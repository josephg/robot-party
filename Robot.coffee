coffeescript = window?.CoffeeScript or require 'coffee-script'
nextTick = process?.nextTick || (fn) -> setTimeout fn, 0

merge = (objs...) ->
  data = {}
  for obj in objs when typeof obj is 'object'
    for own k, v of obj
      data[k] = v
  return data
 
randomId = (length = 10) ->
  chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-="
  (chars[Math.floor(Math.random() * chars.length)] for x in [0...length]).join('')

##
# Messenger is a mixin that provides listen, transmit and receive methods
##
class Messenger
  constructor: ->
    @listeners = {}
    @lid = 0
    @mid = randomId()
  
  # listen 'type', (msg, reply) ->
  # listen {type: 'foo', local: true}, (msg, reply) ->
  # listen ((msg) -> msg.type is 'foo'), (msg, reply) ->
  # listen (msg, reply) ->
  # 
  # reply() takes same arguments as transmit, sets re: header automatically
  listen: (matcher, cb) ->
    [cb, matcher] = [matcher] if not cb?
    #console.log "messenger #{@mid} listening for", matcher
    ok = (msg) => cb.call this, msg, @makeReply(msg)
    @listeners[@lid] = (msg) ->

      return ok(msg) if !matcher?
      return ok(msg) if matcher == msg.type
      return ok(msg) if typeof matcher is 'function' and matcher(msg)
      if typeof matcher is 'object'
        allmatches = true
        for own key, val of matcher
          if msg[key] != val
            #console.log "message didn't match on '#{key}'", "(", msg[key], "!=", val, ")"
            allmatches = false
            break
        #console.log "message did match ", matcher if allmatches
        return ok(msg) if allmatches
              
    return @lid++
  
  unlisten: (id) ->
    delete @listeners[id]

  ##
  # Transmit and listen are the next level up the communication stack.
  # They handle sending and receiving more structured data and have
  # explicit knowledge of message structure, ie types and payloads.
  ##
  # message = {
  #  type,      - identifier used for filtering
  #  local,     - is this message from a trusted (ie me-controlled) zone?
  #  from, to,  - identifies source and destination robots
  #  id, re,    - message identifier and in-reply-to identifier
  #  data       - message payload
  # }
  ##

  # transmit 'type', -> ...
  # transmit {type:'foo'}, 'hi', ->
  # transmit {type:'foo'}, ->
  # transmit {type:'foo', data}, ->
  transmit: (metadata, data, callback) ->
    metadata = {type:metadata} if typeof metadata is 'string'
    [callback, data] = [data] if typeof data is 'function'
    msg = merge @defaults, {data, id: randomId(), from: @id}, metadata

    if callback?
      #console.warn "metadata", metadata, "data", data, "callback", callback, "msgid", msg.id
      lid = @listen {re: msg.id}, (msg) =>
        #console.log "got reply", msg
        callback.call this, msg, @makeReply(msg)
        @unlisten lid
    
    #console.warn "sendRaw", msg.data.message if msg.data.message
    #console.warn "sendRaw", msg
    @sendRaw msg

  #sendRaw defined in subclasses

  makeReply: (msg) ->
    (metadata, data, callback) =>
      metadata = {type:metadata} if typeof metadata is 'string'
      metadata.re ?= msg.id
      @transmit metadata, data, callback

  receive: (msg, source) ->
    msg.data ?= {}
    #console.log "messenger #{@mid} received #{msg.type}:", msg
    listener.call(this, msg, source) for own id, listener of @listeners

  

##
# Children represents a list of robots 'inside' a parent
# They represent, in an abstract sense, a tighter scope than the robot they are inside
# Messages, by default, are bridged from the looser scope (siblings) to a tighter scope (children)
# But they have to be bridged manually the other way
##

class Children extends Messenger
  constructor: (@parent) ->
    super()
    @robots = {}
    @bridge on
    @id = @parent.id

    @listen (msg, source) =>
      nextTick =>
        @each (robot) -> robot.receive msg unless robot is source


  bridge: (x) -> @_bridge = x
    
  each: (fn) -> fn robot for id, robot of @robots

  get: (id) -> @robots[id]

  add: (robocode, reply) ->
    reply ||= (args...) => @transmit args...
    try
      robot = new Robot @parent, robocode
      @robots[robot.id] = robot
      
      reply "robot added", id: robot.id, name: robot.name, info: robot.info

      return robot

    catch e
      reply "error", e
      #console.log "error!"
      return

  sendRaw: (data) -> @receive data

  remove: (robot, reply) ->
    reply ||= (args...) => @transmit args...
    robot = @robots[robot] if typeof robot is "string"
    robot?.remove()
    if @robots[robot.id]
      delete @robots[robot.id]

      reply "robot stopped", robot.id
      return robot
    else
      reply "error", id: robot.id, msg: "no such robot"
      return

defaultbot = ->
  @listen "list robots", (msg, reply) ->
    myrobots = ({id, name, info} for id, {name, info} of @children.robots when @children.robots[id].name)
    reply "I have robots", myrobots if myrobots.length > 0

  @children.listen to: @id, type: "get robot", ({data: id}, reply) ->
    reply "code for robot", @children.get(id).code if @children.get(id)?.code?

  @children.listen to: @id, type: "add robot", ({id: msgid, data: robocode}, reply) ->
    @children.add robocode, reply

  @children.listen to: @id, type: "remove robot", ({id: msgid, data: id}, reply) ->
    @children.remove id, reply


class Robot extends Messenger
  constructor: (@parent, @code) ->
    super()

    [@code, @parent] = [@parent] unless @code?
    @children = new Children this
    @defaults = {}
    @info = {}
    @id = randomId()


    @listen (msg) ->
      if @children._bridge
        @children.receive msg

    if typeof @code is 'string'
      @fn = eval "(function(){" + coffeescript.compile(@code, bare: true) + "})"
    else
      [@fn, @code] = [@code]

    #console.warn "about to apply code", @fn
    @fn.apply this

    unless @info?.eunuch
      defaultbot.apply this

  # Robot directive specifies a robot's details
  # We use this to respond to robot info requests and to set useful defaults
  robot: (@name, @info={}) ->
    @defaults.local = true if @info.local
    @defaults.robot = name

  # SendRaw sends data to children and siblings, if available
  sendRaw: (data) ->
    #console.log "#{@id} sending", data
    if @children._bridge
      @children.receive data, this
    
    @parent?.children.receive data, this
  
  # Deactivate myself and children
  remove: ->
    @children.each (child) -> child.remove()
    @listeners = {}
    @parent = null

if window?
  window.Robot = Robot if window
else
  module.exports = Robot

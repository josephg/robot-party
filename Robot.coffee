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


matchQuery = (obj, query) ->
  if typeof obj is 'object' and typeof query is 'object'
    for key, val of query
      return false unless matchQuery obj[key], val
    return true
  return obj == query


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
    ctx = @ctx or this
    #console.log "messenger #{@mid} listening for", matcher
    ok = (msg, src) -> cb.call ctx, msg, ctx.makeReply(msg), src
    @listeners[@lid] = (msg, src) ->

      return ok(msg, src) if !matcher?
      return ok(msg, src) if matcher == msg.type
      return ok(msg, src) if typeof matcher is 'function' and matcher(msg)
      return ok(msg, src) if typeof matcher is 'object' and matchQuery(msg, matcher)
              
    return @lid++
  
  unlisten: (id) ->
    delete @listeners[id]

  unlistenAll: (id) ->
    @listeners = {}

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
    #console.log "receive from", source?.id
    msg.data ?= {}
    #console.log "messenger #{@mid} received #{msg.type}:", msg
    listener.call(this, msg, source) for own id, listener of @listeners

  

##
# Children represents a list of robots 'inside' a parent
##


class Children extends Messenger
  constructor: (@parent) ->
    super()
    @robots = {}
    @count = 0
    @id = @parent.id
    @ctx = @parent



  distribute: (data, source) ->
    nextTick =>
      @receive data unless @parent is source
      @each (robot) => robot.distribute data, @parent unless robot is source
          
  each: (fn) -> fn robot for id, robot of @robots

  get: (id) -> @robots[id]

  add: (robocode, reply) ->
    @count++
    @hasrobots = true
    reply ||= (args...) => @parent.transmit args...
    try
      robot = new Robot @parent, robocode
      @robots[robot.id] = robot
      
      reply type: "robot added", local: false, data: { id: robot.id, name: robot.name, info: robot.info }

      return robot

    catch e
      reply type: "error", data: {message: e.message, stack:e.stack, type:e.type, arguments:e.arguments}
      console.log "error!", e.message
      return

  sendRaw: (data) -> @distribute data, @parent

  remove: (robot, reply) ->
    @count--
    reply ||= (args...) => @parent.transmit args...
    robot = @robots[robot] if typeof robot is "string"
    robot?.remove()
    if @robots[robot.id]
      delete @robots[robot.id]

      reply type: "robot stopped", local: false, data: robot.id
      return robot
    else
      reply type: "error", data: { id: robot.id, msg: "no such robot" }
      return

defaultbot = ->
  list = (msg, reply) ->
    myrobots = ({id, name, info} for id, {name, info} of @children.robots when @children.robots[id].name)
    myrobots.push {@id, @name, @info} if @info.root

    if myrobots.length > 0
      reply type: "I have robots", local: false, data: myrobots

  @listen "list robots", list
  #@children.listen "list robots", list

  @listen to: @id, type: "get robot", ({data: id}, reply) ->
    # Should make this work properly for the other robot methods"
    if @info.root and id is @id
      reply type: "code for robot", local: false, data: @code
    else if @children.get(id)?.code?
      reply type: "code for robot", local: false, data: @children.get(id).code
    else
      reply type: "error", local: false, data: "no such robot"

  @listen to: @id, trusted: true, type: "add robot", ({id: msgid, data: robocode}, reply) ->
    @children.add robocode, reply

  @listen to: @id, trusted: true, type: "replace robot", ({id: msgid, data: {id, code}}, reply) ->
    if robot = @children.get(id)
      robot.replace code, reply
    else
      reply type: "error", local: false, data: "no such robot"

  @listen to: @id, trusted: true, type: "remove robot", ({id: msgid, data: id}, reply) ->
    @children.remove id, reply


class Robot extends Messenger
  constructor: (@parent, @code) ->
    super()

    [@code, @parent] = [@parent] unless @code?
    @children = new Children this
    @id = randomId()

    @_init @code

  _init: (code) ->
    @defaults = {}
    @info = {}
    @bridge on

    if typeof code is 'string'
      @fn = eval "(function(){" + coffeescript.compile(code, bare: true) + "})"
    else
      [@fn, @code] = [code]

    #console.warn "about to apply code", @fn
    @fn.apply this

    unless @info?.eunuch
      defaultbot.apply this

  replace: (code, reply) ->
    reply ||= (args...) => @parent.transmit args...
    @cleanup()
    @_init code

    reply type: "robot replaced", local: false, data: { id: @id, name: @name, info: @info }

  # Robot directive specifies a robot's details
  # We use this to respond to robot info requests and to set useful defaults
  robot: (@name, info) ->
    @info = info or @info or {}
    @defaults.local = true if @info.local
    @defaults.robot = name

  bridge: (bridge) ->
    idtc = (x, f) -> f(x) # Identity callback

    if typeof bridge is 'object'
      @_bridge.in = bridge.in or (->) if bridge.in isnt undefined
      @_bridge.out = bridge.out or (->) if bridge.out isnt undefined
    else if bridge
      @_bridge = {in: idtc, out: idtc}
    else
      @_bridge = {in: (->), out: (->)}

  distribute: (data, source) ->
    nextTick =>
      @receive data unless source is this
      #TODO: clean this up
      if @parent
        if @parent is source
          @_bridge.in data, (data) => @children.distribute data, source
        else if this is source
          @parent.distribute data, this
          @children.distribute data, source
        else
          @_bridge.out data, (data) => @parent.distribute data, this
          @children.distribute data, source
      else
        @children.distribute data, source
      

  # SendRaw sends data to children and siblings, if available
  sendRaw: (data) ->
    @distribute data, this

  cleanup: ->
    @onCleanup?()
    @unlistenAll()
  
  # Deactivate myself and children
  remove: ->
    @cleanup()
    @children.each (child) -> child.remove()
    @parent = null

if window?
  window.Robot = Robot if window
else
  module.exports = Robot

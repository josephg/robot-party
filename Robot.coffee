coffeescript = window?.CoffeeScript or require 'coffee-script'

merge = (objs...) ->
  data = {}
  for obj in objs when typeof obj is 'object'
    for own k, v of obj
      data[k] = v
  return data
 
randomId = (length = 10) ->
  chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-="
  (chars[Math.floor(Math.random() * chars.length)] for x in [0...length]).join('')

class Robot
  constructor: (@hub, @code) ->
    @listeners = {}
    @listenerId = 0
    @defaults = {}
    @id = randomId()

    Hub = window?.Hub or require './Hub'

    if typeof @code is 'string'
      @fn = eval "(function(){" + coffeescript.compile(@code, bare: true) + "})"
    else
      [@fn, @code] = [@code]

    @fn.apply this

  receive: (msg) ->
    msg.data ?= {}
    for own id, listener of @listeners
      listener.call this, msg

  makeReplyCB: (msg) ->
    (metadata, data, callback) =>
      metadata = {type:metadata} if typeof metadata is 'string'
      metadata.re ?= msg.id
      @transmit metadata, data, callback

  # transmit 'type', -> ...
  # transmit {type:'foo'}, 'hi', ->
  # transmit {type:'foo'}, ->
  # transmit {type:'foo', data}, ->
  transmit: (metadata, data, callback) ->
    metadata = {type:metadata} if typeof metadata is 'string'
    [callback, data] = [data] if typeof data is 'function'

    msg = merge @defaults, {data, id: randomId(), from: @id}, metadata
    @sendRaw msg, callback

  sendRaw: (data, callback) ->
    if callback?
      lid = @listenerId

      @listeners[lid] = (msg) ->
        if msg.re == data.id
          callback.call this, msg, @makeReplyCB(msg)
          @unlisten lid
      
      @listenerId++

    @hub.broadcast this, data
    
  listen: (matcher, fn) ->
    [fn, matcher] = [matcher] if not fn?

    @listeners[@listenerId] = (msg) ->
      {type} = msg
      ok = => fn.call this, msg, @makeReplyCB(msg)

      return ok() if !matcher?
      return ok() if matcher == type
      return ok() if typeof matcher is 'function' and matcher(type)
      if typeof matcher is 'object'
        allmatches = true
        for own key, val of matcher
          if msg[key] != val
            #console.log "message didn't match on '#{key}'", "(", msg[key], "!=", val, ")"
            allmatches = false
            break

        return ok() if allmatches
              
    @listenerId++
  
  unlisten: (id) ->
    delete @listeners[id]
      
  robot: (@name, @info={}) ->
    @defaults.local = true if @info.local
    @defaults.robot = name
   
  remove: ->
    @listeners = {}
    @hub = {broadcast: ->}

if window?
  window.Robot = Robot if window
else
  module.exports = Robot

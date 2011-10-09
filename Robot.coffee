coffeescript = window?.CoffeeScript or require 'coffee-script'

class Robot
  constructor: (@hub, @code) ->
    @listeners = {}
    @listenerId = 0
    @defaults = {}
    @id = @randomId()

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
    return (type, data, extradata, callback) =>
      [callback, extradata] = [extradata] if typeof extradata is 'function'
      replydata = @mergeData({re: msg.id}, extradata)

      @transmit type, data, replydata, callback
  
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
      
  randomId: (length = 10) ->
    chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-="
    (chars[Math.floor(Math.random() * chars.length)] for x in [0...length]).join('')

  transmit: (type, data, extradata, callback) ->
    [callback, extradata] = [extradata] if typeof extradata is 'function'
    
    msg = @mergeData @defaults, {type, data, id: @randomId(), from: @id}, extradata
    @sendRaw msg, callback

  mergeData: (objs...) ->
    data = {}
    for obj in objs when typeof obj is 'object'
      for own k, v of obj
        data[k] = v
    return data


  robot: (@name, @info={}) ->
    @defaults.local = true if @info.local
    @defaults.robot = name

  sendRaw: (data, callback) ->

    if callback?
      lid = @listenerId

      @listeners[lid] = (msg) ->
        if msg.re == data.id
          callback.call this, msg, @makeReplyCB(msg)
          @unlisten lid
      
      @listenerId++

    @hub.broadcast this, data
        
  remove: ->
    @listeners = {}
    @hub = {broadcast: ->}

if window?
  window.Robot = Robot if window
else
  module.exports = Robot

coffeescript = window?.CoffeeScript or require 'coffee-script'

class Robot
  constructor: (@emit, @code) ->
    @listeners = {}
    @listenerId = 0
    @defaults = {}

    Hub = window?.Hub or require './Hub'

    if typeof @code == 'string'
      @code = eval "(function(){" + coffeescript.compile(@code, bare: true) + "})" 

    @code.apply this

  receive: (msg) ->
    msg.data ?= {}
    for own id, listener of @listeners
      listener.call this, msg

  makeReplyCB: (msg) ->
    return (type, data, extradata, callback) =>
      [callback, extradata] = [extradata] if typeof extradata is 'function'
      replydata = @mergeData({replyto: msg.id}, extradata)

      @transmit type, data, replydata, callback
  
  listen: (matcher, fn) ->
    [fn, matcher] = [matcher] if not fn?

    @listeners[@listenerId] = (msg) ->
      {type} = msg
      if !matcher or matcher == type or matcher?(type)

        fn.call this, msg, @makeReplyCB(msg)
              
    @listenerId++
  
  unlisten: (id) ->
    delete @listeners[id]
      
  randomId: (length = 10) ->
    chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-="
    (chars[Math.floor(Math.random() * chars.length)] for x in [0...length]).join('')

  transmit: (type, data, extradata, callback) ->
    [callback, extradata] = [extradata] if typeof extradata is 'function'
    
    msg = @mergeData @defaults, {type, data, id: @randomId()}, extradata
    @sendRaw msg, callback

  mergeData: (objs...) ->
    data = {}
    for obj in objs when typeof obj is 'object'
      for own k, v of obj
        data[k] = v
    return data


  sendRaw: (data, callback) ->

    if callback?
      lid = @listenerId

      @listeners[lid] = (msg) ->
        if msg.replyto == data.id
          callback.call this, msg, @makeReplyCB(msg)
          @unlisten lid
      
      @listenerId++

    @emit this, data
        
  remove: ->
    @listeners = {}
    @emit = ->

if window?
	window.Robot = Robot if window
else
	module.exports = Robot

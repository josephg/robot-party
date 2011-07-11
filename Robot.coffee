coffeescript = require 'coffee-script' unless coffeescript?

class Robot
  constructor: (@emit, @code) ->
    @listeners = {}
    @listenerId = 0

    Hub = require './Hub' unless Hub?

    if typeof @code == 'string'
      console.log "Robot is", Robot
      @code = eval "(function(){" + coffeescript.compile(@code, bare: true) + "})" 

    @code.apply this

  receive: (msg) ->
    msg.data ||= {}
    for own id, listener of @listeners
      listener.call this, msg
  
  listen: (matcher, fn) ->
    [fn, matcher] = [matcher] if not fn?

    @listeners[@listenerId] = (msg) ->
      {type} = msg
      if !matcher or matcher == type or matcher?(type)
        replycb = (type, data, callback) =>
          @reply msg.id, type, data, callback

        fn.call this, msg, replycb
              
    @listenerId++
  
  unlisten: (id) ->
    delete @listeners[id]
      
  randomId: (length = 10) ->
    chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-="
    (chars[Math.floor(Math.random() * chars.length)] for x in [0...length]).join('')

  reply: (replyid, type, data, callback) ->
    msg = {type, data}
    msg.id = @randomId()
    msg.replyto = replyid
    @sendRaw msg, callback

  transmit: (type, data, callback) ->
    msg = {type, data}
    msg.id = @randomId()
    @sendRaw msg, callback

  sendRaw: (data, callback) ->
    @emit data

    if callback?
      lid = @listenerId

      @listeners[lid] = (msg) ->
        if msg.replyto == data.id
          callback.call this, msg
          @unlisten lid
      
      @listenerId++
        
  remove: ->
    @listeners = {}
    @emit = ->

if window?
	window.Robot = Robot if window
else
	module.exports = Robot

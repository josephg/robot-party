class Robot
  @robots: []
  
  @setSocket: (socket) ->
    socket.on 'message', @receive

    @emit = (msg) ->
      robot.receive msg for robot in Robot.robots when robot isnt this
      socket.json.send msg


  @receive: (msg) =>
    robot.receive msg for robot in Robot.robots

  @remove: (robot) ->
    idx = @robots.indexOf robot
    @robots.splice(idx, 1) if idx >= 0

  
  constructor: (@code) ->
    @emit = Robot.emit
    @listeners = {}
    @listenerId = 0

    Robot.robots.push this

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
    @sendMsg msg, callback

  transmit: (type, data, callback) ->
    msg = {type, data}
    msg.id = @randomId()
    @sendMsg msg, callback

  sendMsg: (data, callback) ->
    @emit data

    if callback?
      lid = @listenerId

      @listeners[lid] = (msg) ->
        if msg.replyto == data.id
          callback.call this, msg
          @unlisten lid
      
      @listenerId++
        
  remove: ->
    Robot.remove this

if window?
	window.Robot = Robot if window
else
	module.exports = Robot


class Robot
  @robots: []
  
  @setSocket: (socket) ->
    socket.on 'message', @receive

    @emit = (msg) ->
      robot.receive msg for robot in Robot.robots when robot isnt this
      socket.json.send msg


  @receive: (msg) ->
    robot.receive msg for robot in @robots

  @remove: (robot) ->
    idx = @robots.indexOf robot
    @robots.splice(idx, 1) if idx >= 0

  
  constructor: (code) ->
    @emit = Robot.emit
    @listeners = {}
    @listenerId = 0

    Robot.robots.push this

    code.apply this

  receive: (msg) ->
    for own id, listener of @listeners
      listener.call this, msg
  
  listen: (matcher, fn) ->
    [fn, matcher] = [matcher] if not fn?

    @listeners[@listenerId] = (msg) ->
      {type} = msg
      if !matcher or matcher == type or matcher(type)
        fn.call this, msg
              
      @listenerId++
  
  unlisten: (id) ->
    delete @listeners[id]
      
  transmit: (data) ->
    @emit data

  remove: ->
    Robot.remove this

if window?
	window.Robot = Robot if window
else
	module.exports = Robot


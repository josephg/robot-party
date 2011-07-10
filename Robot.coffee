class Robot
  @robots: []
  
  @setSocket: (socket) ->
    socket.on 'tx', @receive

    @emit = (msg) ->
      console.log "emitting", msg, "from", this
      console.log "sending to robots:", Robot.robots
      robot.receive msg for robot in Robot.robots when robot isnt this
      socket.emit msg


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
    console.log "received", msg
    for own id, listener of @listeners
      listener.call this, JSON.parse(msg)
  
  listen: (matcher, fn) ->
    [fn, matcher] = [matcher] if not fn?

    @listeners[@listenerId] = (msg) ->
      {type} = msg
      console.log "matching", msg, "against", matcher
      if !matcher or matcher == type or matcher(type)
        console.log "matched"
        fn.call this, msg
              
      @listenerId++
  
  unlisten: (id) ->
    delete @listeners[id]
      
  transmit: (data) ->
    @emit JSON.stringify(data)

  remove: ->
    Robot.remove this

if window?
	window.Robot = Robot if window
else
	module.exports = Robot


Robot = window?.Robot or require './Robot'

nextTick = process?.nextTick || (fn) -> setTimeout fn, 0

# Wait for the function to be called a given number of times, then call the callback.
expectCalls = (n, callback) ->
	remaining = n
	->
		remaining--
		if remaining == 0
			callback()
		else if remaining < 0
			throw new Error "expectCalls called more than #{n} times"

hubfn = ->
  @robot 'hubbot'
    hub: true

  @listen "list robots", (msg, reply) ->
    reply "I have robots", ({id, name, info} for id, {name, info} of @hub.robots when @hub.robots[id].name)

  @listen to: @id, type: "get robot", ({data: id}, reply) ->
    reply "code for robot", @hub.robots[id].code if @hub.robots[id]?.code?

  @listen to: @id, local: true, type: "add robot", ({id: msgid, data: robocode}, reply) ->
    @hub.add robocode, msgid

  @listen to: @id, local: true, type: "remove robot", ({id: msgid, data: id}, reply) ->
    @hub.remove id, msgid


class Hub
  constructor: ->
    @robots = {}
    @hubbot = @add hubfn
    @id = @hubbot.id

  broadcast: (source, msg) =>
    nextTick =>
      robot.receive msg for id, robot of @robots when robot isnt source

  add: (robocode, msgid) ->
    try
      robot = new Robot this, robocode
      @robots[robot.id] = robot
      
      @hubbot?.transmit type: "robot added", re: msgid, data: {id: robot.id, name: robot.name, info: robot.info}

      return robot

    catch e
      @hubbot?.transmit type: "error", re: msgid, data: e
      return


  remove: (robot, msgid) ->
    robot = @robots[robot] if typeof robot is "string"
    robot?.remove()
    if @robots[robot.id]
      delete @robots[robot.id]

      @hubbot?.transmit type: "robot stopped", re: msgid, data: robot.id
      return robot
    else
      @hubbot?.transmit type: "error", re: msgid, data: {id: robot.id, msg: "no such robot"}
      return


  # This loads a robot given its name, or an array of robots, or an object of robot dependancies.
  load: (robots, callback) ->
    loadOne = (name, callback) =>
      @hubbot.transmit {type:'load robot', local:true, data:name}, ({type, data}) =>
        @add data if type == 'robocode'
        callback?()

    if typeof robots is 'function'
      robots()
      callback?()
    else if typeof robots is 'string'
      loadOne robots, callback
    else if Array.isArray robots
      f = expectCalls robots.length, callback
      @load r, f for r in robots
    else if typeof robots is 'object'
      num = 0 # First we'll count the number of things in the object
      num++ for k, v of robots
      f = expectCalls num, callback
      loadOne k, (do (v) => => @load v, callback) for k, v of robots
    else
      callback?()

if window?
  window.Hub = Hub if window
else
  module.exports = Hub

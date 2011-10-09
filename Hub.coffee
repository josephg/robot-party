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

  @listen to: @id, local: true, type: "add robot", ({data: robocode}, reply) ->
    try
      robot = @hub.add robocode
      reply "robot added", robot.id
    catch e
      reply "error", e

  @listen to: @id, local: true, type: "remove robot", ({data: id}, reply) ->
    if @hub.remove id
      reply "robot stopped", id
    else
      reply "error", {id, msg: "no such robot"}


class Hub
  constructor: ->
    @robots = {}
    @hubbot = @add hubfn
    @id = @hubbot.id

  broadcast: (source, msg) =>
    nextTick =>
      robot.receive msg for id, robot of @robots when robot isnt source

  add: (robocode) ->
    robot = new Robot this, robocode
    @robots[robot.id] = robot
    return robot

  remove: (robot) ->
    robot = @robots[robot] if typeof robot is "string"
    robot?.remove()
    delete @robots[robot.id]
    robot

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

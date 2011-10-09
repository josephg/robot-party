Robot = window?.Robot or require './Robot'

nextTick = process?.nextTick || (fn) -> setTimeout fn, 0

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

  load: (name, fn) ->
    @hubbot.transmit 'load robot', name, {local:true}, ({type, data}) =>
      @add data if type == 'robocode'
      fn?()

if window?
  window.Hub = Hub if window
else
  module.exports = Hub

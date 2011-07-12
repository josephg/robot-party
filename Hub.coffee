Robot = window?.Robot or require './Robot'

class Hub
  constructor: ->
    @robots = []
  
  emit: (source, msg) =>
    setTimeout =>
      #console.log "emitting", msg, "from", source, "to", @robots
      robot.receive msg for robot in @robots.slice() when robot isnt source
    ,0

  add: (robocode) ->
    robot = new Robot @emit, robocode
    @robots.push robot
    return robot

  remove: (robot) ->
    robot.remove()
    
    idx = @robots.indexOf robot
    @robots.splice(idx, 1) if idx >= 0


if window?
  window.Hub = Hub if window
else
  module.exports = Hub

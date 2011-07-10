io = require 'socket.io-client'
party = io.connect 'http://localhost:8080'



Robot.setSocket party

robotRunningRobot = new Robot ->
    
    coffeescript = require 'coffee-script'
    fs = require 'fs'
    robolib = require 'robolib'
    
    robots = {}
    
        try
            robotext = fs.readFileSync(__dirname + 'robots.json', 'utf8')
            throw "No robots" unless robotext
            robots = JSON.parse robotext
        
        catch
            #Oh well...
            console.log "Couldn't load robots from robots.json"

    @listen "run robot", (msg) ->
        [roboname, robocode] = msg.data
        robofun = new Function(coffeescript.compile robocode)
        robots[roboname] = new Robot(robofun)
        
        fs.writeFile(__dirname + 'robots.json', JSON.stringify robots)
    
    
    @listen "*", (data) ->
        robot.receive(data) for own roboname, robot of robots
            
party.on 'tx', (data) -> robotRunningRobot.receive(data)


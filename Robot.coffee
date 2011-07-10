class Robot
    @setSocket: (socket) ->
     @emit = (d) ->
        socket.emit d

    constructor: (code) ->
        @emit = Robot.emit
        @listeners = {}
        @listenerId = 0

        code.apply(@)

    receive: (msg) ->
        for own id, listener of @listeners
            listener data
    
    listen: (matcher, fn) =>
        @listeners[listenerId] = ->
            {name, data} = msg
            if matcher is "*" or matcher == name or matcher(name)
                fn(msg)
                
        @listenerId++
    
    unlisten: (id) =>
        delete @listeners[id]
        
    transmit: (data) =>
        @emit 'tx', JSON.stringify(data)

window.Robot = Robot if window

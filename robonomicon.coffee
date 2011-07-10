server = require('http').createServer()
io = require('socket.io').listen(server)
io.sockets.on 'connection', (s) -> s.on('tx', (d) -> s.broadcast.emit('tx',d))
server.listen 8080

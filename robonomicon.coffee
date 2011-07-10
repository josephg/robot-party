connect = require 'connect'
app = connect connect.static(__dirname + '/public')
io = require('socket.io').listen(app)
io.configure -> io.set 'log level', 2
io.sockets.on 'connection', (s) -> s.on('tx', (d) -> s.broadcast.emit('tx',d))
app.listen 8080

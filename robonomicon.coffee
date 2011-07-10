connect = require 'connect'
app = connect connect.static(__dirname + '/public')
io = require('socket.io').listen(app)
io.sockets.on 'connection', (s) -> s.on 'message', (d) -> s.broadcast.json.send d
app.listen 8080

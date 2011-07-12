io = require('socket.io').listen 4321
io.sockets.on 'connection', (s) -> s.on 'message', (d) -> s.broadcast.json.send d

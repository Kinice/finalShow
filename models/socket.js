var socketio = {};  
var socket_io = require('socket.io');  
  
// get io
socketio.getSocketio = function(server){  
    var io = socket_io.listen(server);
    io.on('connection', function(socket){
        console.log('a user connected');
        socket.on('socket message', function(msg) {
            console.log(msg);
            io.emit('socket message', msg);
        })
        socket.on('disconnect', function(){
            console.log('user disconnected');
        });
    });
};  
  
module.exports = socketio;
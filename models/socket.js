var socketio = {};  
var socket_io = require('socket.io');  
  
// get io
socketio.getSocketio = function(server){  
    var io = socket_io.listen(server);
    io.on('connection', function(socket){
        var userInfo = {
            id: socket.id,
            username: ''
        }
        console.log('a user connected');
        socket.on('user connect', function(msg) {
            io.emit('user connect', msg)
            userInfo.username = msg.username
        })
        socket.on('socket message', function(msg) {
            console.log(msg);
            io.emit('socket message', msg);
        })
        socket.on('disconnect', function(){
            console.log('user' + userInfo.username +' disconnected');
            io.emit('user disconnect', {
                username: userInfo.username
            })
        });
    });
};  
  
module.exports = socketio;
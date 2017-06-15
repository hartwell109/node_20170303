/**
 * Created by Mars on 2017/5/2.
 */
var config = require('../config');

var io = require('socket.io')();

io.on('connection', function (socket) {
    socket.on('toServer', function (data) {
        var msg = {
            channel: 'socketio',
            title: 'toServer',
            payload: data,
            timestamp: new Date()
        }
        process.send(msg);
    })
})

io.listen(config.socketio.port);

process.on('message', function (msg) {
    io.emit('toClient', msg.payload);
})

io.on('disconnect', function () {
    console.log('socket.io disconnect')
})


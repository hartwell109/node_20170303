/**
 * Created by Mars on 2017/5/2.
 */
var io = require('socket.io')();
var config = require('../config');

io.listen(config.socketio.port);

io.on('connection', function (socket) {
    socket.on('toServer', function (data) {
        var msg = {
            channel: 'socketio',
            title: 'connection',
            payload: data,
            timestamp: new Date()
        }
        /**
         * 回复客户端消息
         */
        socket.emit('toClient', msg)
        /*
         将消息发送到主进程
         */
        process.send(msg);
    })
})

process.on('message', function (msg) {
    io.emit('toClient', msg.payload);
})

io.on('disconnect', function () {
    console.log('socket.io disconnect')
})


/**
 * Created by Linpent109 on 20180106
 */
var config = require('../config');
var SerialPort = require('serialport');
var serialPort = new SerialPort(config.serialport.comName, config.serialport.options);

process.on("message", function (msg, err) {
    serialPort.write(msg.payload, function (err) {
        if (err) {
            return console.log('Error on write: ', err.message);
        }
        console.log('message written %s', msg);
    });
})

serialPort.on('error', function (err) {
    var msg = {
        channel: 'serialport',
        title: 'err',
        payload: err,
        timestamp: new Date()
    }
    process.send(msg)
    console.log('Error: ', err);
})


serialPort.on('open', function (msg) {
    var msg = {
        channel: 'serialport',
        title: 'open',
        payload: msg,
        timestamp: new Date()
    }
    process.send(msg)
    console.log('Open: ', msg);
})

/**
 * 收到端口消息，发送给主进程
 */
serialPort.on('data', function (data) {
    var msg = {
        channel: 'serialport',
        title: 'data',
        payload: data,
        timestamp: new Date()
    }
    process.send(msg)
    console.log('data:', data)
});
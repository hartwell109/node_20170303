/**
 * Created by Mars on 2017/5/4.
 */
var config = require('../config');
var mqtt = require('mqtt');

var client = mqtt.connect(config.mqtt.url);

client.on('connect', function () {
    var msg = {
        channel: 'mqtt',
        title: '',
        payload: 'mqtt has connected.',
        timestamp: new Date()
    }
    process.send(msg);
})

client.subscribe(config.mqtt.topic);

client.on('message', function (topic, message) {
    var msg = {
        channel: 'mqtt',
        topic: topic,
        payload: message,
        timestamp: new Date()
    }
    process.send(msg);
})

process.on('message', function (msg) {
    client.publish(config.mqtt.topic, msg);
})
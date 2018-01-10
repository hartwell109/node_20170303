/**
 * Created by Linpeng109 on 2017/5/4.
 */
var config = require('../config');
var mqtt = require('mqtt');

/**
 * 链接mqtt服务并订阅mqtt消息主题
 */
var mqttClient = mqtt.connect(config.mqtt.url);
mqttClient.subscribe(config.mqtt.topic);

/**
 * 收到mqtt链接成功信息后，发送消息到主进程
 */
mqttClient.on('connect', function () {
    var msg = {
        channel: 'mqtt',
        title: 'connect',
        payload: 'mqtt has connected.',
        timestamp: new Date()
    }
    process.send(msg);
})

/**
 * 收到MQTT信息后,解析信息并上传到主进程
 */
mqttClient.on('message', function (topic, message) {
    var msg = {
        channel: 'mqtt',
        title: 'message',
        payload: message.toString(),
        timestamp: new Date()
    }
    process.send(msg);
})

/**
 * 收到主进程发送的发送mqtt消息指令后，调用client发送消息
 */
process.on('message', function (msg) {
    mqttClient.publish(config.mqtt.topic, msg);
})
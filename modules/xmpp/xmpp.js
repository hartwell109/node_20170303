/**
 * Created by Mars on 2017/5/2.
 */
var config = require('../config');
var xmpp = require('simple-xmpp');

xmpp.connect({
    jid: config.xmpp.jid,
    password: config.xmpp.password,
    host: config.xmpp.host,
    port: config.xmpp.port
});

xmpp.on('online', function (data) {
    var message = 'Connected with JID ' + config.xmpp.jid;
    process.send({channel: 'xmpp', title: 'online', payload: message});
});

xmpp.on('error', function (err) {
    process.send({channel: 'xmpp', title: 'error', payload: err});
});

xmpp.on('chat', function (from, data) {
    process.send({channel: 'xmpp', title: 'char', payload: data});
})

xmpp.on('close', function () {
    process.send({channel: 'xmpp', title: 'char', payload: 'connection has been closed!'});
});

process.on('message',function (to, message) {

})

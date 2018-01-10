/**
 * Created by Linpeng109 on 2017/5/2.
 */
var config = require('../config');
var xmppClient = require('simple-xmpp');

xmppClient.connect({
    jid: config.xmpp.jid,
    password: config.xmpp.password,
    host: config.xmpp.host,
    port: config.xmpp.port
});

xmppClient.on('online', function (data) {
    var message = 'Connected with JID ' + config.xmpp.jid;
    process.send({channel: 'xmpp', title: 'online', payload: message});
});

xmppClient.on('error', function (err) {
    process.send({channel: 'xmpp', title: 'error', payload: err});
});

xmppClient.on('chat', function (from, data) {
    process.send({channel: 'xmpp', title: 'char', payload: data});
})

xmppClient.on('close', function () {
    process.send({channel: 'xmpp', title: 'char', payload: 'connection has been closed!'});
});

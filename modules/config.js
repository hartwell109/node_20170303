/**
 * Created by Mars on 2017/3/8.
 * mongodb://<dbuser>:<dbpassword>@ds021989.mlab.com:21989/mongodb_test_20160324
 */
var config = {
    redisStore: {
        host: '192.168.16.220',
        port: 6379,
        ttl: 1800,
        secret: 'lin.peng@union.com.cn',
        resave: false,
        saveUninitialized: false
    },
    mongodb: {
        dbUrl: 'ds021989.mlab.com',
        dbPort: '21989',
        dbUser: 'root',
        dbPassword: 'admin',
        dbName: 'mongodb_test_20160324',
        options: {
            server: {
                poolSize: 100,
                auto_reconnect: true,
                keepAlive: 10
            }
        }
    },
    xmpp: {
        host: 'jwchat.org',
        port: 5222,
        jid: 'nodejs109@jwchat.org',
        password: 'patient681020'
    },
    mqtt: {
        url: 'mqtt://test.mosquitto.org',
        topic: 'topic'
    },
    socketio: {
        port: 3333
    }
}
module.exports = config
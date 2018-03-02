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
            poolSize: 100,
            auto_reconnect: true,
            keepAlive: 10,
            reconnectTries: 100
        }
    },
    xmpp: {
        host: 'jwchat.org',
        port: 5222,
        jid: 'nodejs109@jwchat.org',
        password: 'patient681020',
        reconnectionAllowed: true
    },
    mqtt: {
        url: 'mqtt://test.mosquitto.org',
        topic: 'test.mosquitto.org'
    },
    socketio: {
        port: 3333,
        reconnection: true,
        autoConnect: true
    },
    serialport: {
        comName: "/dev/ttyUSB0",
        options: {
            baudRate: 9600,
            dataBits: 8,
            stopBits: 1,
            parity: "none"
        }
    },
    crt310: {
        com: "COM4"
    }
}
module.exports = config
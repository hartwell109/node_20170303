/**
 * Created by Mars on 2017/3/8.
 * mongodb://<dbuser>:<dbpassword>@ds021989.mlab.com:21989/mongodb_test_20160324
 */
var config = {
    mongodb: {
        dbUser: 'root',
        dbPassword: 'admin',
        dbUrl: 'ds021989.mlab.com',
        dbPort: '21989',
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
        jid: 'node@t1.xmpp.yibeikafei.cn',
        password: 'node',
        host: '47.93.49.110',
        port: 5222
    },
    mqtt: {
        url: 'mqtt://test.mosquitto.org',
        topic: 'topic'
    }
}
module.exports = config
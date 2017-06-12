/**
 * Created by Mars on 2017/3/8.
 * mongodb://<dbuser>:<dbpassword>@ds021989.mlab.com:21989/mongodb_test_20160324
 */
var config = {
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
}
module.exports = config
/**
 * Created by Mars on 2017/3/8.
 */
'use strict';
var config = require('.//config');
var mongoose = require('mongoose');
var bluebird = require('bluebird');
var log = require('winston');
mongoose.Promise = bluebird;

/**
 * 数据库连接的事件处理
 */
mongoose.connection.once('open', function () {
    log.info('MongoDB event open');
    log.debug('MongoDB connected [%s]', config.databaseUrl);
});
mongoose.connection.on('connected', function () {
    log.info('MongoDB event connected');
});
mongoose.connection.on('disconnected', function () {
    log.warn('MongoDB event disconnected');
});
mongoose.connection.on('reconnected', function () {
    log.info('MongoDB event reconnected');
});
mongoose.connection.on('error', function (err) {
    log.error('MongoDB event error: ' + err);
});

var url = 'mongodb://' + config.dbUser + ':' + config.dbPassword + '@' + config.dbUrl + ':' + config.dbPort + '/' + config.dbName;
console.log(url);
mongoose.connect(url);

module.exports = mongoose;
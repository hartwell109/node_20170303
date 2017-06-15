/**
 * Created by Mars on 2017/3/8.
 */
var logger = require('winston')
var config = require('../config')
var mongoose = require('mongoose');
var bluebird = require('bluebird')
mongoose.Promise = bluebird;

var url = "mongodb://" + config.mongodb.dbUser + ":" + config.mongodb.dbPassword + "@" + config.mongodb.dbUrl + ":" + config.mongodb.dbPort + "/" + config.mongodb.dbName;
console.log(url);

mongoose.connect(url, config.mongodb.options);

mongoose.connection.once('open', function () {
    console.log("The mongoLab is opened.")
})
mongoose.connection.on('error', function (err) {
    console.log(err);
})
mongoose.connection.on('connected', function () {
    console.log('The mongoLab is connected.');
})
mongoose.connection.on('reconnected', function () {
    console.log('The mongoLab is reconnected.');
})

module.exports = mongoose;
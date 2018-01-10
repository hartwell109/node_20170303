/**
 * Created by Linpeng109 on 2018/01/06
 */
var mongoose = require('mongoose')
var bluebird = require('bluebird')
var config = require('../config')

mongoose.Promise = bluebird;

var url = "mongodb://"
    + config.mongodb.dbUser + ":"
    + config.mongodb.dbPassword + "@"
    + config.mongodb.dbUrl + ":"
    + config.mongodb.dbPort + "/"
    + config.mongodb.dbName;

console.log("The URL is %s", url)

mongoose.connect(url, config.mongodb.options)

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

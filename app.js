var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var childProcess = require('child_process');

var cors = require('cors');
// global.cors = cors;
/**
 * 加载数据库模块
 */
var mongoose = require('./modules/mongdb/mongoose');
var model = require('./modules/mongdb/model')(mongoose)
global.model = model

/**
 * 加载通讯模块
 */
var xmppProcess = childProcess.fork('./modules/xmpp/xmpp');
xmppProcess.on('message', function (message) {
    console.log(message)
})
var mqttProcess = childProcess.fork('./modules/mqtt/mqtt')
mqttProcess.on('message', function (message) {
    console.log(message)
})
var serialportProcess = childProcess.fork('./modules/serialport/serialport')
serialportProcess.on('message', function (message) {
    console.log(message)
})
var socketioProcess = childProcess.fork('./modules/socketio/socketio')
socketioProcess.on('message', function (message) {
    console.log(message)
})

/**
 * 初始化设备驱动
 */
var crt310Process = childProcess.fork('./modules/device/crt310')

/**
 * 保存全局变量
 * @type {{xmppProcess: *, mqttProcess: *, serialportProcess: *, socketioProcess: *, crt310Process: *}}
 */
global.processies = {
    xmppProcess: xmppProcess,
    mqttProcess: mqttProcess,
    serialportProcess: serialportProcess,
    socketioProcess: socketioProcess,
    crt310Process: crt310Process
}

/**
 * 加载页面模块
 */
var index = require('./routes/index');
var users = require('./routes/users');
var processies = require('./routes/processies')
var crt310 = require('./routes/crt310')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/', index);
app.use('/users', users);
app.use('/processies', processies)
app.use('/device', crt310)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;

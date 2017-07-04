var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

/**
 * 加载用户认证及权限管理
 */
var passPort = require('passport')
var LocalStrategy = require('passport-local').Strategy
const user = {
    username: 'test-user',
    password: 'test-password',
    id: 1
}
passport.use(new LocalStrategy(
    function (username, password, done) {
        findUser(username, function (err, user) {
            if (err) {
                return done(err)
            }
            if (!user) {
                return done(null, false)
            }
            if (password !== user.password) {
                return done(null, false)
            }
            return done(null, user)
        })
    }
))

var session = require('express-session')
var RedisStore = require('connect-redis')(session)

/**
 * 加载config配置
 */
var config = require('./modules/config')

/**
 * 加载数据库模块
 */
var mongoose = require('./modules/mongodb/mongoose');
global.dao = require('./modules/dao/dao')(mongoose);

/**
 * 加载通讯模块
 */
var childProcess = require('child_process');
var xmpp = childProcess.fork('./modules/xmpp/xmpp');
var mqtt = childProcess.fork('./modules/mqtt/mqtt');
var socketio = childProcess.fork('./modules/socketio/socketio');

xmpp.on('message', function (msg) {
    console.log(msg);
})

mqtt.on('message', function (msg) {
    console.log(msg)
})

socketio.on('message', function (msg) {
    console.log(msg)
})

var index = require('./routes/index');
var users = require('./routes/users');
var dao = require('./routes/dao');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
//app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/**
 * 加载cookie设置
 */
app.use(cookieParser(config.redisStore.secret))

/**
 * 加载认证与权限管理
 */
app.use(session({
    store: new RedisStore({
        host: config.redisStore.host,
        port: config.redisStore.port,
        ttl: config.redisStore.ttl
    }),
    cookie: {},
    secret: config.redisStore.secret,
    resave: config.redisStore.resave,
    saveUninitialized: config.redisStore.saveUninitialized
}))
app.use(passPort.initialize())
app.use(passPort.session())


app.use('/', index);
app.use('/users', users);
app.use('/dao', dao);

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

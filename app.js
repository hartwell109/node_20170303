var express = require('express');
var path = require('path');
var app = express();

/**
 * 加载config配置
 */
var config = require('./modules/config')

/**
 * 加载日志处理
 */
var logger = require('morgan');
app.use(logger('dev'));
global.logger = logger

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
    console.log('xmpp:', msg);
})
mqtt.on('message', function (msg) {
    console.log('mqtt:', msg)
})
socketio.on('message', function (msg) {
    console.log('socketio:', msg)
})

/**
 * 加载网站标识
 * 将favicon文件放置于/public目录下
 */
var favicon = require('serve-favicon');
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

/**
 * 配置客户端请求的body的解析
 */
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

/**
 * 加载静态页面目录
 */
app.use(express.static(path.join(__dirname, 'public')));

/**
 * 加载cookie设置
 */
var cookieParser = require('cookie-parser');
app.use(cookieParser(config.redisStore.secret))

/**
 * 加载Session管理
 */
var session = require('express-session')
var RedisStore = require('connect-redis')(session)
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

/*
 加载权限管理
 */
var passport = require('passport')
var LocalStratagy = require('passport-local')
var user = {
    username: 'abcd',
    password: 'abcd',
    id: 1
}
passport.use('local', new LocalStratagy(
    function (username, password, done) {
        console.log('passport initial')
        findUser(username, function (err, user) {
            console.log('username:' + username)
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
passport.authenticationMiddleware = function () {
    return function (req, res, next) {
        console.log('authenticationMiddleware =' + req.isAuthenticated())
        if (req.isAuthenticated()) {
            return next()
        }
        res.redirect('/')
    }
}

app.use(passport.initialize())
app.use(passport.session())

/**
 * 加载动态页面
 */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
var index = require('./routes/index');
var users = require('./routes/users');
var dao = require('./routes/dao');
app.use('/', index);
app.use('/users', users);
app.use('/dao', passport.authenticationMiddleware(), dao);

/**
 * 加载页面未找到错误
 */
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/**
 * 加载服务器错误
 */
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;

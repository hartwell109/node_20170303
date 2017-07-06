/**
 * Created by Mars on 2017/7/5.
 */
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const user = {
    username: 'abcd',
    password: 'abcd',
    id: 1
}
var findUser = function (username, callback) {
    console.log('findUser:' + username)
    if (username === user.username) {
        callback(null, user)
    } else {
        callback(null, null)
    }
}

passport.serializeUser(function (user, cb) {
    cb(null, user.username)
})

passport.deserializeUser(function (username, cb) {
    findUser(username, cb)
})

var authenticationMiddleware = function () {
    return function (req, res, next) {
        console.log('authenticationMiddleware =' + req.isAuthenticated())
        if (req.isAuthenticated()) {
            return next()
        }
        res.redirect('/')
    }
}
passport.use(new LocalStrategy(
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
passport.authenticationMiddleware = authenticationMiddleware
module.exports = passport
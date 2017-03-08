/**
 * Created by Mecury on 2017/3/8.
 */
var express = require('express');
var router = express.Router();
router.get('/', function (req, res, next) {
    res.send('Welcome to dao page!')
});
router.get('/insert', function (req, res, next) {
    var User = global.dao.User;
    var user = new User({
        userName: 'aa2233',
        passWord: 'aa2233'
    })
    user.save(function (err, result) {
        if (err) {
            console.log(err);
        } else {
            console.log(result)
            res.send(result);
        }
    })
});
router.get('/list', function (req, res, next) {
    var User = global.dao.User;
    var pageSize = 10;
    var pageNum = 1;
    User.find({})
        .skip(pageNum * pageSize)
        .limit(pageSize)
        .then(function (err, result) {
            if (err) {
                console.log((err))
            } else {
                console.log(result);
                res.json(result)
            }
        })
});
module.exports = router;
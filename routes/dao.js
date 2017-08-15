/**
 * Created by Mars on 2017/3/8.
 */
var express = require('express');
var router = express.Router();
var dao = global.dao;


router.get('/list', function (req, res, next) {
    var User = dao.User;
    var user = new User({
        userName: 'aaabbcc'
    });
    var pageSize = 10;
    var pageNum = 0;
    User.find({userName: 'aabbcc'})
        .select('_id userName passWord')
        .limit(pageSize)
        .skip(pageSize * pageNum)
        .then(function (result) {
            res.send(result);
        })
        .catch(function (err) {
            console.log(err)
        })

})


router.get('/insert', function (req, res, next) {
    var User = dao.User;
    var user = new User({
        userName: 'aaabbcc',
        passWord: 'aaabbcc'
    });
    user.save()
        .then(function (err, result) {
            if (err) {
                console.log(err);
            } else {
                console.log(result);
                res.send(result);
            }
        })

})

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
            // console.log(result)
            res.send(result);
        }
    })
});
router.get('/list', function (req, res) {
    var token = req.header('token')
    console.log('token=%s', token)

    var User = global.dao.User;
    var pageSize = req.query.pageSize || req.body.pageSize || req.params.pageSize
    if (pageSize == '' || pageSize == null || pageSize < 0) {
        pageSize = 10;
    } else {
        pageSize = parseInt(pageSize)
    }
    var pageNum = req.query.pageNum || req.body.pageNum || req.params.pageNum
    if (pageNum == '' || pageNum == null || pageNum < 0) {
        pageNum = 0;
    } else {
        pageNum = parseInt(pageNum)
    }
    console.log('pageSize = %s;pageNum = %s', pageSize, pageNum)
    User.find({})
        .skip(pageNum * pageSize)
        .limit(pageSize)
        .then(function (result, err) {
            if (err) {
                console.log(err)
            } else {
                // console.log(result);
                res.jsonp(result)
            }
        })
});

module.exports = router;
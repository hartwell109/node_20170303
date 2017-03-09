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
    // user.save(function (error, result) {
    //     if (error) {
    //         console.log(error);
    //     } else {
    //         res.send(result);
    //     }
    // })
    user
        .save()
        .then(function (err, result) {
            if (err) {
                console.log(err);
            } else {
                console.log(result);
                res.send(result);
            }
        })

})

module.exports = router;
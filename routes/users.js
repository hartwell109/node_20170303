var express = require('express');
var router = express.Router();
var userModel = global.model.userModel;
var randamize = require('randomatic');

/**
 *  GET users listing.
 **/
router.get('/', function (req, res, next) {
    res.status(200).send('Welcome to user')
    next();
})

router.get('/all', function (req, res, next) {
    userModel.find({})
        .then(function (result) {
            res.status(200).send(result.toString())
        })
        .catch(function (err) {
            console.log(err)
        })
});

router.get('/count', function (req, res, next) {
    userModel.count({})
        .then(function (result) {
            res.status(200).send("The user's count is " + result)
            console.log(result)
        })
        .catch(function (err) {
            console.log(err)
        })
})

router.get('/save', function (req, res, next) {
    new userModel({
        username: randamize('Aa0', 8),
        password: randamize('Aa0', 8)
    })
        .save()
        .then(function (result) {
            console.log(result)
            res.status(200).send(result)
        })
        .catch(function (err) {
            console.log(err)
        })
})
module.exports = router;

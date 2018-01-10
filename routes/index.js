var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    var session = req.session;
    session.count = session.count || 0
    var n = session.count++
    res.send('hello, session id:' + session.id + ' count:' + n)
    // res.render('index', {title: 'Express'});
});

module.exports = router;
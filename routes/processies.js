var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    res.status(200).send("Welcome to processies")
})
router.get('/serialport', function (req, res, next) {
    var cmd = req.query.cmd
    var msg = {
        payload: cmd
    }
    global.processies.serialportProcess.send(msg)
    res.status(200).send("Command " + cmd + " has be written success")
})
module.exports = router;

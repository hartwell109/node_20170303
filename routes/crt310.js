var express = require('express');
var router = express.Router();
var crt310 = require("../modules/device/crt310")

var msg = {
    eventid: '',
    data: {}
}


router.get('/crt310/demo', function (req, res) {
    var cmd = req.query.cmd
    var result =
        global.processies.crt310Process.send(cmd)
    res.send('success')
})

module.exports = router;
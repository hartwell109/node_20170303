var express = require('express');
var router = express.Router();
var crt310 = require("../modules/device/crt310")


router.get('/crt310/commOpen', function (req, res) {
    var result = 0;
    crt310.commOpen(function (handle, error) {
        if (handle == 0) {
            result = "error";
        } else {
            result = handle;
            crt310.reset(handle, function (handle, error) {
            })

            crt310.cardSetting(handle, function (handle, error) {
            })
        }
    })
    res.send('commOpen:' + result);
});

module.exports = router;
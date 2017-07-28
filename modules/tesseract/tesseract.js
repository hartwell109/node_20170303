var request = require('request')
var tesseract = require('node-tesseract')
var fs = require('fs')

var process = function (imgUrl, toPath, callback) {
    request(
        encodeURI(imgUrl))
        .on('error', function (err) {
            console.log(err)

        })
        .pipe(fs.createWriteStream(toPath)
            .on('finish', function () {
                console.log('The %s has be saved to %s', imgUrl, toPath)
                tesseract.process(toPath, function (err, result) {
                    if (err) {
                        console.log(err)
                    } else {
                        callback(result)
                    }
                })
            }))
}
module.exports = {
    process: process
}
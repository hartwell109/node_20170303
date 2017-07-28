var tesseract = require('./modules/tesseract/tesseract')
var imgUrl = 'http://202.99.45.97:9052/CIS-CHSSF/captcha.jpg'
var toPath = 'd:\\temp.jpg'
/**
 * 调用方式
 */
tesseract.process(imgUrl, toPath, function (result) {
    console.log('result:' + result)
})
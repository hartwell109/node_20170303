var jwt = require('jwt-simple')

/**
 * 获取访问端的ip地址
 */
var getRemoteAddress = function (req, res) {
    var ip = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress
    if (ip.substr(0, 7) == "::ffff:") {
        ip = ip.substr(7)
    }
    return ip
}

/**
 * 获取指定访问参数username/password
 */
var checkUser = function (req, res) {
    var username = req.params.username || req.body.username || req.query.username
    var password = req.params.password || req.body.password || req.query.password
    var user = {username: username, password: password}
    return true
}

/**
 * 生成token
 */
const secret = 'abcdefg'
const alg = 'HS256'
var payload = {
    iss: getRemoteAddress(req, res),
    auth: true,
    expires: Math.round((new Date().getTime() / 1000)) + 3600,
    roles: ['ROLE_ADMIN', 'ROLE_USER']
}
var encodeToken = function (payload, secret, alg) {
    var token = jwt.encode(payload, secret, alg)
    return token
}
var token = encodeToken(payload, secret, alg)
console.log('token:' + token)

/**
 * 获取x-access-token
 */
var getXAccessToken = function (req, res) {
    var x_access_token = req.header['x-access-token']
    return x_access_token
}

/**
 * 检测token
 */



/**
 * 解析token
 */
var decodeToken = function (token) {
    var result = JSON.stringify(jwt.decode(token, secret, alg))
    return result
}
console.log('result:' + decodeToken(token))

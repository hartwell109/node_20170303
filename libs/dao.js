/**
<<<<<<< HEAD
 * Created by Mars on 2017/3/8.
 */
module.exports = function (mongoose) {
    var userSchema = mongoose.Schema({
        userName: {type: String, unique: true},
        passWord: String,
        eMail: String
=======
 * Created by Mecury on 2017/3/8.
 */

module.exports = function (mongoose) {
    var userSchema = mongoose.Schema({
        userName: {type: String},
        passWord: {type: String},
        eMail: {type: String}
>>>>>>> c27c412206e10b15d480851ed984f72ca86eafa8
    });
    var User = mongoose.model('User', userSchema);
    return {User: User}
}
/**
 * Created by Mecury on 2017/3/8.
 */

module.exports = function (mongoose) {
    var userSchema = mongoose.Schema({
        userName: {type: String},
        passWord: {type: String},
        eMail: {type: String}
    });
    var User = mongoose.model('User', userSchema);
    return {User: User}
}
/**
 * Created by Mars on 2017/3/8.
 */
module.exports = function (mongoose) {
    var userSchema = mongoose.Schema({
        userName: {type: String, unique: true},
        passWord: String,
        eMail: String
    });
    var User = mongoose.model('User', userSchema);
    return {User: User}
}
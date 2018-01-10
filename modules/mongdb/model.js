/**
 * Created by Linpeng109 on 2018/01/06
 * @param mongoose
 * @returns {{userModel}}
 */
module.exports = function (mongoose) {
    var userSchema = mongoose.Schema(
        {
            userName: {type: String},
            passWord: {type: String},
            eMail: {type: String}
        }
    )
    var userModel = mongoose.model("User", userSchema)
    return {
        userModel: userModel
    }
}
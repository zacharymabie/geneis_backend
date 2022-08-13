const mongoose = require('mongoose');

const userFollowSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    followedUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }
})

userFollowSchema.virtual('id').get(function(){
    return this._id.toHexString();
})

userFollowSchema.set('toJSON', {
    virtuals:true
})


exports.User = mongoose.model('UserFollow', userFollowSchema);
exports.userFollowSchema = userFollowSchema;
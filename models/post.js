const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    caption: {
        type: String,
        default:''
    },
    image: {
        type: String,
        default:''
    },
    //TODO: ARRAY FOR LIKES AND COMMENTS
})

postSchema.virtual('id').get(function(){
    return this._id.toHexString();
})

postSchema.set('toJSON', {
    virtuals:true
})


exports.Post = mongoose.model('Post', postSchema);
exports.postSchema = postSchema;
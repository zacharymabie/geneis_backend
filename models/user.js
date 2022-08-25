const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
<<<<<<< HEAD
  username: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  age: {
    type: Number,
  },
  weight: {
    type: Number,
  },
  height: {
    type: Number,
  },
  profilePic: {
    type: String,
  },
  followed: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserFollow",
    },
  ],
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserFollow",
    },
  ],
});
=======
    username: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default:false
    },
    age: {
        type: Number
    },
    weight: {
        type: Number
    },
    height: {
        type: Number
    },
    profilePic:{
        type: String
    },
    followed:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserFollow"
    }],
    following:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserFollow"
    }],
    bio: {
        type: String,
        default: ""
    }
})

userSchema.virtual('id').get(function(){
    return this._id.toHexString();
})
>>>>>>> 3aedb2484a80dcf44accacdc304b9968f7161e35

userSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

userSchema.set("toJSON", {
  virtuals: true,
});

exports.User = mongoose.model("User", userSchema);
exports.userSchema = userSchema;

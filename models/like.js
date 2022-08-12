const mongoose = require("mongoose");

const likeSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

likeSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

likeSchema.set("toJSON", {
  virtuals: true,
});

exports.Like = mongoose.model("Like", likeSchema);

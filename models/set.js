const mongoose = require("mongoose");

const setSchema = mongoose.Schema({
  reps: {
    type: Number,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
});

setSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

setSchema.set("toJSON", {
  virtuals: true,
});

exports.Set = mongoose.model("Set", setSchema);

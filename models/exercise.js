const mongoose = require("mongoose");

const exerciseSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  restTime: {
    type: Number,
    default: 0,
  },
  remarks: {
    type: String,
    default: "",
  },
  sets: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Set",
      required: true,
    },
  ],
});

exerciseSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

exerciseSchema.set("toJSON", {
  virtuals: true,
});

exports.Exercise = mongoose.model("Exercise", exerciseSchema);

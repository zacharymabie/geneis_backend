const mongoose = require("mongoose");

const programSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  image: {
    type: String,
    default: "",
  },
  description: {
    type: String,
    default: "",
  },
  workouts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workout",
      required: true,
    },
  ],
  level: {
    type: Number,
    default: 0,
  },
  rating: {
    type: Number,
    default: 0,
  },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
});

programSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

programSchema.set("toJSON", {
  virtuals: true,
});

exports.Program = mongoose.model("Program", programSchema);

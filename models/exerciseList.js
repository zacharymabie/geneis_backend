const mongoose = require("mongoose");

const exerciseListSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  exercises: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exercise",
    },
  ],
});

exerciseListSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

exerciseListSchema.set("toJSON", {
  virtuals: true,
});

exports.Like = mongoose.model("ExerciseList", exerciseListSchema);

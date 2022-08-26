const { default: mongoose } = require("mongoose");

const workoutSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  exercises: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exercise",
      required: true,
    },
  ],
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

workoutSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

workoutSchema.set("toJSON", {
  virtuals: true,
});

exports.Workout = mongoose.model("Workout", workoutSchema);

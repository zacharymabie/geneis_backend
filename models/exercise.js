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

  /* Todo
    add array field for sets
    */
});

exerciseSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

exerciseSchema.set("toJSON", {
  virtuals: true,
});

exports.exerciseSchema = mongoose.model("Exercise", exerciseSchema);

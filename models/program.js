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
  description: {
    type: String,
    default: "",
  },
  level: {
    type: Number,
    default: 0,
  },
  rating: {
    type: Number,
    default: 0,
  },

  /* Todo
    add array field for exercises and users and comments
    */
});

programSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

programSchema.set("toJSON", {
  virtuals: true,
});

exports.ProgramSchema = mongoose.model("Exercise", programSchema);

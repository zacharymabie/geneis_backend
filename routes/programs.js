const { Program } = require("../models/program");
const express = require("express");
const { Workout } = require("../models/workout");
const router = express.Router();
const { User } = require("../models/user");
const { Comment } = require("../models/comment");

//Get list of all programs
router.get(`/`, async (req, res) => {
  const programList = await Program.find().populate("workouts author");

  if (!programList) {
    res.status(500).json({ success: false });
  }
  res.send(programList);
});

//Get a specific Program from ID
router.get(`/:id`, async (req, res) => {
  const program = await Program.findById(req.params.id);

  if (!program) {
    res
      .status(500)
      .json({ message: "The program with the given ID was not found" });
  }
  res.status(200).send(program);
});

//Get Programs created by a specific user
router.get(`/user/:id`, async (req, res) => {
  const userId = req.params.id;
  const workoutList = await Workout.find({ author: `${userId}` }).exec();

  if (!workoutList) {
    res.status(500).json({ success: false });
  }
  res.status(200).send(workoutList);
});

//Post to create a new Program
router.post("/", async (req, res) => {
  const user = await User.findById(req.body.author);
  if (!user) return res.status(400).send("Invalid User");

  const workoutsIds = req.body.workouts;
  workoutsIds.map(async (workoutId) => {
    const workout = await Workout.findById(workoutId);
    if (!workout) return res.status(400).send("Invalid Workouts");
  });

  let program = new Program({
    name: req.body.name,
    author: req.body.author,
    description: req.body.description,
    workouts: req.body.workouts,
    level: req.body.level,
    rating: req.body.rating,
  });

  program = await program.save();

  if (!program) return res.status(404).send("The program cannot be created");

  res.send(program);
});

//Put to edit Programs and add comments and Users
// Need to ensure previous comment object array is added along with any new comments
router.put("/:id", async (req, res) => {
  const commentsIds = Promise.all(
    req.body.comments.map(async (comment) => {
      const user = await User.findById(comment.author);
      if (!user) return res.status(400).send("Invalid User");

      let newComment = new Comment({
        author: comment.author,
        content: comment.content,
      });

      newComment = await newComment.save();

      return newComment._id;
    })
  );

  const newCommentsIdsResolved = await commentsIds;

  const userIds = req.body.users;
  userIds.map(async (userId) => {
    const user = await User.findById(userId);
    if (!user) return res.status(400).send("Invalid Users");
  });

  const workoutsIds = req.body.workouts;
  workoutsIds.map(async (workoutId) => {
    const workout = await Workout.findById(workoutId);
    if (!workout) return res.status(400).send("Invalid Workouts");
  });

  const program = await Program.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      description: req.body.description,
      workouts: req.body.workouts,
      level: req.body.level,
      rating: req.body.rating,
      users: req.body.users,
      comments: newCommentsIdsResolved,
    },
    {
      new: true,
    }
  );
  if (!program) return res.status(404).send("The program cannot be changed");

  res.send(program);
});

router.delete("/:id", (req, res) => {
  Program.findByIdAndRemove(req.params.id).then(async (program) => {
    if (program) {
      await program.comments.map(async (comment) => {
        await Comment.findByIdAndRemove(comment);
      });
      return res
        .status(200)
        .json({ success: true, message: "The program has been deleted" });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Program not found" });
    }
  });
});

module.exports = router;

//Testing
//author: 62f627a8fc65975e12b69c05
//workouts: 62f768c48d82c9b5c98a3542
//62f763418a554dc63cd05637

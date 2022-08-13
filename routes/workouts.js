const { Workout } = require("../models/workout");
const express = require("express");
const router = express.Router();
const { User } = require("../models/user");
const { Exercise } = require("../models/exercise");

//Get list of all workouts
router.get(`/`, async (req, res) => {
  const workoutList = await Workout.find().populate("exercises");

  if (!workoutList) {
    res.status(500).json({ success: false });
  }
  res.send(workoutList);
});

//Get a specific workout from ID
router.get(`/:id`, async (req, res) => {
  const workout = await Workout.findById(req.params.id);

  if (!workout) {
    res
      .status(500)
      .json({ message: "The workout with the given ID was not found" });
  }
  res.status(200).send(workout);
});

//Get workouts created by a specific user
router.get(`/user/:id`, async (req, res) => {
  const userId = req.params.id;
  const workoutList = await Workout.find({ author: `${userId}` }).exec();

  if (!workoutList) {
    res.status(500).json({ success: false });
  }
  res.status(200).send(workoutList);
});

//Post to create a new Workout
router.post("/", async (req, res) => {
  const user = await User.findById(req.body.author);
  if (!user) return res.status(400).send("Invalid User");

  let workout = new Workout({
    name: req.body.name,
    author: req.body.author,
    description: req.body.description,
    exercises: req.body.exercises,
  });

  workout = await workout.save();

  if (!workout) return res.status(404).send("The workout cannot be created");

  res.send(workout);
});

module.exports = router;

//62f6531f88434ff1308686d8
//62f64b427d6282ae503abae2

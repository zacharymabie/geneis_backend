const { Exercise } = require("../models/exercise");
const express = require("express");
const { User } = require("../models/user");
const { Set } = require("../models/set");
const router = express.Router();

//Get list of all exercises
router.get(`/`, async (req, res) => {
  const exerciseList = await Exercise.find().populate("sets");

  if (!exerciseList) {
    res.status(500).json({ success: false });
  }
  res.status(200).send(exerciseList);
});

//Get a specific exercise from ID
router.get(`/:id`, async (req, res) => {
  const exercise = await Exercise.findById(req.params.id);

  if (!exercise) {
    res
      .status(500)
      .json({ message: "The exercise with the given ID was not found" });
  }
  res.status(200).send(exercise);
});

//Get exercises for a specific user
router.get(`/user/:id`, async (req, res) => {
  const userId = req.params.id;
  const exerciseList = await Exercise.find({ user: `${userId}` }).exec();

  if (!exerciseList) {
    res.status(500).json({ success: false });
  }
  res.status(200).send(exerciseList);
});

//Post to create new exercise
router.post("/", async (req, res) => {
  const user = await User.findById(req.body.user);
  if (!user) return res.status(400).send("Invalid User");

  const setsIds = Promise.all(
    req.body.sets.map(async (set) => {
      let newSet = new Set({
        reps: set.reps,
        weight: set.weight,
      });

      newSet = await newSet.save();

      return newSet._id;
    })
  );

  const newSetsIdsResolved = await setsIds;

  let exercise = new Exercise({
    name: req.body.name,
    user: req.body.user,
    restTime: req.body.restTime,
    remarks: req.body.remarks,
    sets: newSetsIdsResolved,
  });

  exercise = await exercise.save();

  if (!exercise) return res.status(404).send("The exercise cannot be created");

  res.send(exercise);
});

router.delete("/:id", (req, res) => {
  Exercise.findByIdAndRemove(req.params.id).then(async (exercise) => {
    if (exercise) {
      await exercise.sets.map(async (set) => {
        await Set.findByIdAndRemove(set);
      });
      return res
        .status(200)
        .json({ success: true, message: "The exercise has been deleted" });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Exercise not found" });
    }
  });
});

module.exports = router;

const { Workout } = require("../models/workout");
const express = require("express");
const router = express.Router();
const { User } = require("../models/user");
const { Exercise } = require("../models/exercise");
const { Set } = require("../models/set");

//Get list of all Workouts
router.get(`/`, async (req, res) => {
  const workoutList = await Workout.find().populate("exercises");

  if (!workoutList) {
    res.status(500).json({ success: false });
  }
  res.send(workoutList);
});

//Get a specific Workout from ID
router.get(`/:id`, async (req, res) => {
  const workout = await Workout.findById(req.params.id);

  if (!workout) {
    res
      .status(500)
      .json({ message: "The workout with the given ID was not found" });
  }
  res.status(200).send(workout);
});

//Get Workouts created by a specific user
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

  const exercisesIds = Promise.all(
    req.body.exercises.map(async (exercise) => {
      const setsIds = Promise.all(
        exercise.sets.map(async (set) => {
          let newSet = new Set({
            reps: set.reps,
            weight: set.weight,
          });
          newSet = await newSet.save();
          return newSet._id;
        })
      );
      const newSetsIdsResolved = await setsIds;
      let newExercise = new Exercise({
        name: exercise.name,
        user: exercise.user,
        restTime: exercise.restTime,
        remarks: exercise.remarks,
        sets: newSetsIdsResolved,
      });

      newExercise = await newExercise.save();

      return newExercise._id;
    })
  );

  const newExerciseIdsResolved = await exercisesIds;

  let workout = new Workout({
    name: req.body.name,
    author: req.body.author,
    description: req.body.description,
    exercises: newExerciseIdsResolved,
  });

  workout = await workout.save();

  if (!workout) return res.status(404).send("The workout cannot be created");

  res.send(workout);
});

//Put to change exercises and description of a Workout
router.put("/:id", async (req, res) => {
  if (req.body.exercises != undefined) {
    const exercisesIds = req.body.exercises;
    exercisesIds.map(async (exerciseId) => {
      const exercise = await Workout.findById(exerciseId);
      if (!exercise) return res.status(400).send("Invalid Exercises");
    });
  }

  const workout = await Workout.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      description: req.body.description,
      exercises: req.body.exercises,
    },
    {
      new: true,
    }
  );
  if (!workout) return res.status(404).send("The workout cannot be changed");

  res.send(workout);
});

//Delete a Workout
router.delete("/:id", (req, res) => {
  Workout.findByIdAndRemove(req.params.id)
    .then((workout) => {
      if (workout) {
        return res
          .status(200)
          .json({ success: true, message: "The workout has been deleted" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "The workout cannot be found" });
      }
    })
    .catch((err) => {
      return res.status(400).json({ success: false, error: err });
    });
});

module.exports = router;

//62f6531f88434ff1308686d8
//62f64b427d6282ae503abae2

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const authJwt = require("./helpers/jwt");
const errorHandler = require("./helpers/error-handler");

require("dotenv/config");
const api = process.env.API_URL;

app.use(cors());
app.options("*", cors());

//middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));
app.use(bodyParser.json());
app.use(morgan("tiny"));
app.use(authJwt());
app.use("/public/uploads", express.static(__dirname + "/public/uploads"));
app.use(errorHandler);

//routes
const usersRouter = require("./routes/users.js");
const postsRouter = require("./routes/posts.js");
const exercisesRouter = require("./routes/exercises.js");
const workoutsRouter = require("./routes/workouts");
const programsRouter = require("./routes/programs.js");
app.use(`${api}/users`, usersRouter);
app.use(`${api}/posts`, postsRouter);
app.use(`${api}/exercises`, exercisesRouter);
app.use(`${api}/workouts`, workoutsRouter);
app.use(`${api}/programs`, programsRouter);

mongoose
  .connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "genesis-database",
  })
  .then(() => {
    console.log("Database connection is ready...");
  })
  .catch((err) => {
    console.log(err);
  });

//APP.Listen starts up the API on a server, specifying the port as it's first parameter
// app.listen(4000, () => {
//   console.log("Serving running on 127.0.0.1:4000");
// });

var server = app.listen(process.env.PORT || 4000, function () {
  var port = server.address().port;
  console.log(port);
});

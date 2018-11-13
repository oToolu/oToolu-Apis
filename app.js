const config = require("config");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const users = require("./routes/users");
const auth = require("./routes/auth");
const error = require("./middleware/error");
const express = require("express");
const app = express();
app.use(express.json());

require("./startup/logging")();

if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwtPrivateKey is not defined.");
  process.exit(1);
}

app.use("/api/users", users);
app.use("/api/auth", auth);
app.use(error);
require("./startup/prod")(app);

module.exports = app;
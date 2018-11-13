const log = require("debug");
const winston = require("winston");
const app = require("./app");
const config = require("config");
const Joi = require("joi");
const mongoose = require("mongoose");

mongoose
  .connect(
    config.get("db"),
    { useNewUrlParser: true }
  )
  .then(() => winston.info("Connected to MongoDB..."));

const port = process.env.PORT || 3000;
app.listen(port, () => winston.info(`Listening on port ${port}...`));

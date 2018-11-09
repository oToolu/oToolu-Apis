const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const auth = require("../middleware/auth");
const { User, validate } = require("../models/user");
const express = require("express");
const router = express.Router();

router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
});

router.get("/", async (req, res) => {
  let users = await User.find({});
  if (!users) return res.status(400).send("No user found");

  res.status(200).send(_.pick(users, ["_id", "name", "email"]));
});

router.post("/login", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (
    user &&
    user.email == req.body.email &&
    user.password == req.body.password
  )
    //redirect to the home page
    return res.status(200).send("Login success!");
  else if (
    user &&
    user.email == req.body.email &&
    user.password != req.body.password
  )
    return res.status(400).send("Password is incorrect!");
  else if (!user) return res.status(400).send("Invalid email id!");
  else return res.status(400).send("User not registered.");
});

router.post("/register", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered.");

  user = new User(_.pick(req.body, ["name", "email", "password"]));
  console.log(user);
  const token = user.generateAuthToken();
  user.token = token;
  await user.save();

  res
    .header("x-auth-token", token)
    .send(_.pick(user, ["_id", "name", "email"]));
});

router.post("/registerWithMobile", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ phone: req.body.phone });
  if (user) return res.status(400).send("User already registered.");

  user = new User(_.pick(req.body, ["name", "mobile", "password"]));
  console.log(user);
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  const token = user.generateAuthToken();
  user.token = token;
  await user.save();

  res
    .header("x-auth-token", token)
    .send(_.pick(user, ["_id", "name", "mobile"]));
});
module.exports = router;

const express = require("express");
const mongoose = require("mongoose");

const auth = require("../../middlewares/auth.js");
const validator = require("../../middlewares/validator.js");
const { encryptPassword } = require("../../libs/encrypt.js");
const { sendWelcomeEmail } = require('../config/email');
const { idGenerator } = require('../../libs/userId');

const router = express.Router();
const userModel = mongoose.model("User");

// Only User route
router.get("/", auth.loggedIn, (req, res) => {
  res.redirect("/signup");
});

// Sign Up Route
router.get("/signup", auth.loggedIn, (req, res) => {
  res.render("./user/signup");
});

// Sign Up Post
router.post("/signup", auth.loggedIn, validator.emailExist, (req, res) => {
  const today = Date.now();

  // Create user and accure data from body
  const newUser = new userModel({
    userId: idGenerator(),
    fullname: req.body.fullname,
    infos: req.body.infos,
    email: req.body.email,
    username: req.body.username,
    userImg: "uploads\\user.svg",
    password: encryptPassword(req.body.password),
    createdAt: today,
    updatedAt: today
  });

  newUser.save( (err, result) => {
    if (err) {
      throw err;

    } else if (!result) {

      res.status(404).render("4O4", {
        title: "User not created",
        url_1: 'deactive',
        url_2: 'deactive',
        url_3: 'deactive',
        url_4: 'deactive',
        redirect: "/user/signup",
        status: 404,
        watermark: '{{ User Is Not Created, Please Try Again... }}',
        error: "",
        user: req.session.user,
        chat: req.session.chat
      });

    } else {
      req.user = result;
      delete req.user.password;
      req.session.user = result;
      delete req.session.user.password;
      res.redirect("/dashboard");
      sendWelcomeEmail(req.session.user.email, req.session.user.fullname);
    }
  });
});

module.exports = router;
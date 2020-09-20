const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const auth = require("../../middlewares/auth.js");
const uploadimg = require("../../middlewares/uploadimg");
const {
  sendUpdateEmail,
  changePasswordEmail,
  sendCancelationEmail,
} = require("./../config/email");
const { calculateAge } = require("./../../libs/age");
const { encryptPassword, comparePassword } = require("../../libs/encrypt.js");

const userModel = mongoose.model("User");

// Set Dashboard Route
router.get("/", auth.checkLogin, (req, res) => {
  res.render("./dashboard/home", {
    user: req.session.user
  });
});

// Router Upadte Profile POST
router.post(
  "/profile",
  auth.checkLogin,
  uploadimg.upload.single("userImg"),
  (req, res, next) => {
    console.log(req.file);
    var i = 0;
    const today = Date.now();
    const {
      fullname,
      infos,
      usergender,
      dateofbirth,
      github,
      youtube,
    } = req.body;

    // var users = req.session.user._id;
    const _id = req.session.user._id;

    userModel.updateOne(
      { _id },
      {
        $set: {
          fullname,
          infos,
          usergender,
          dateofbirth,
          age: calculateAge(dateofbirth),
          userImg: req.file.path,
          github,
          youtube,
          updatedAt: today,
          __v: ++i,
        },
      },
      (err) => {
        if (err) {
          throw err;
        }

        // Set the updated data
        userModel.findOne({ _id }, (err, result) => {
          if (err) {
            console.log(err);
          } else {
            // req.user = result;
            req.session.user = result;
            res.redirect("/dashboard");
          }
        });
      }
    );
    sendUpdateEmail(req.session.user.email, req.session.user.fullname);
  }
);

// Router Change Password POST
router.post("/changepass", auth.checkLogin, (req, res, next) => {
  userModel.findOne({ email: req.session.user.email }, (err, result) => {
    var pass = comparePassword(req.body.oldpassword, result.password);

    if (err) {
      throw err;
    } else if (!pass) {
      res.status(404).render("4O4", {
        title: "Error Password change",
        url_1: "deactive",
        url_2: "deactive",
        url_3: "deactive",
        url_4: "deactive",
        redirect: "/dashboard",
        status: 404,
        watermark:
          "{{ Password didn't match..Try Again with correct Password }}",
        error: "",
        user: req.session.user,
        chat: req.session.chat,
      });
    } else {
      var epass = encryptPassword(req.body.password);

      userModel.updateOne(
        { email: req.session.user.email },
        {
          password: epass,
        },
        (err) => {
          if (err) {
            throw err;
          }
          delete req.session.user.password;
          req.session.user.password = epass;
          res.redirect("/dashboard");
        }
      );
    }
  });
  changePasswordEmail(req.session.user.email, req.session.user.fullname);
});

// Route for Delete Account From User collection
router.get("/delete", auth.checkLogin, (req, res, next) => {
  const _id = req.session.user._id;

  userModel.deleteOne({ _id }, {}, (err) => {
    if (err) {
      throw err;
    }
    delete req.session.user;
    res.redirect("/user/login");
  });
  sendCancelationEmail(
    req.session.user.email,
    req.session.user.username,
    req.session.user.fullname
  );
});

module.exports = router;
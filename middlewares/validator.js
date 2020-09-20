const mongoose = require("mongoose");
const userModel = mongoose.model("User");

// Checking Existing user.
module.exports.emailExist = (req, res, next) => {
  userModel.findOne({ email: req.body.email }, (err, result) => {
    if (err) {
      throw err;
      
    } else if (result) {
      res.status(500).render("4O4", {
        title: "Email Exist",
        url_1: 'deactive',
        url_2: 'deactive',
        url_3: 'deactive',
        url_4: 'deactive',
        redirect: "/user/signup",
        status: 500,
        watermark: '{{ Email Already Exist. Try again }}',
        error: err,
        user: req.session.user
      });
    } else {
      next();
    }
  });
};
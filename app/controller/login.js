const express = require("express");
const mongoose = require("mongoose");

const auth = require("../../middlewares/auth.js");
const { comparePassword } = require("../../libs/encrypt.js");

const router = express.Router();
const userModel = mongoose.model("User");

// Login Route
router.get("/login", auth.loggedIn, (req, res) => {
    res.render("./user/login");
});

// Login Post Route
router.post("/login", auth.loggedIn, (req, res) => {
    userModel.findOne({ email: req.body.email }, (err, result) => {
        if (err) {
            throw err;

        } else if (!result) {

            res.status(404).render("4O4", {
                title: "User not found",
                url_1: 'deactive',
                url_2: 'deactive',
                url_3: 'deactive',
                url_4: 'deactive',
                redirect: "/user/login",
                status: 404,
                watermark: '{{ User Not Found, Please check details }}',
                error: "",
                user: req.session.user,
                chat: req.session.chat
            });

        } else {
            var pass = comparePassword(req.body.password, result.password);
            if (!pass) {

                res.status(404).render("4O4", {
                    title: "Password didn't match",
                    url_1: 'deactive',
                    url_2: 'deactive',
                    url_3: 'deactive',
                    url_4: 'deactive',
                    redirect: "/user/login",
                    status: 404,
                    watermark: '{{ Password didn\'t match. Try Again }}',
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
            }
        }
    });
});

// Logout Handle Route
router.get("/logout", (req, res) => {
    delete req.session.user;
    res.redirect("/user/login");
});

module.exports = router;
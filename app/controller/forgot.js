const express = require("express");
const mongoose = require("mongoose");
const async = require("async");
const crypto = require("crypto");

const auth = require("../../middlewares/auth.js");
const { encryptPassword } = require("../../libs/encrypt.js");
const { forgetPasswordEmail, reserPasswordEmail } = require('./../config/email');

const router = express.Router();
const userModel = mongoose.model("User");

// Forgot Password Route
router.get("/forgot", auth.loggedIn, (req, res) => {
    res.render("./forgot/forgot");
});

// Passwors Reset Route
router.get('/reset/:token', auth.loggedIn, (req, res) => {
    userModel.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpire: { $gt: Date.now() }
    }, (err, result) => {
        if (err) {
            throw err;

        } else if (!result) {

            res.status(404).render("4O4", {
                title: "User not found",
                url_1: 'deactive',
                url_2: 'deactive',
                url_3: 'deactive',
                url_4: 'deactive',
                redirect: "/user/forgot",
                status: 404,
                watermark: 'Password reset token is invalid or has expired.',
                error: "",
                user: req.session.user
            });

        } else {
            res.render('./forgot/reset', {
                token: req.params.token
            });
        }
    });
});

// Forgot Password Post Route
router.post("/forgot", auth.loggedIn, (req, res, next) => {
    async.waterfall([(done) => {
        crypto.randomBytes(20, function (err, buf) {
            var token = buf.toString('hex');
            done(err, token);
        });
    }, (token, done) => {
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
                    redirect: "/user/forgot",
                    status: 404,
                    watermark: '{{ Email not exist, Try again }}',
                    error: "",
                    user: req.session.user
                });

            } else {
                result.resetPasswordToken = token;
                result.resetPasswordExpire = Date.now() + 3600000;

                result.save((err) => {
                    done(err, token, result);
                });
            }
        });
    }, (token, result, done) => {
        forgetPasswordEmail(result.email, req.headers.host, token);
        // That won't work because after that we redirect the page to home
        done("Email has been sended sucessfully");
        // res.redirect("/");
    }
    ], (err) => {
        if (err) return next(err);
        res.redirect('/user/forgot');
    });
});

// Password Reset Post Route
router.post('/reset/:token', (req, res) => {
    async.waterfall([(done) => {
        userModel.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpire: { $gt: Date.now() }
        }, (err, result) => {
            if (err) {
                throw err;

            } else if (!result) {

                res.status(404).render("4O4", {
                    title: "User not found",
                    url_1: 'deactive',
                    url_2: 'deactive',
                    url_3: 'deactive',
                    url_4: 'deactive',
                    redirect: "/user/forgot",
                    status: 404,
                    watermark: 'Password reset token is invalid or has expired.',
                    error: "",
                    user: req.session.user
                });

            } else {
                const epass = encryptPassword(req.body.password);
                userModel.updateOne({ resetPasswordToken: req.params.token }, {
                    password: encryptPassword(req.body.password),
                    resetPasswordToken: "",
                    resetPasswordExpires: undefined
                }, (err) => {
                    if (err) throw err;

                    req.session.user = result;
                    delete req.session.user.password;
                    req.session.user.password = epass;
                    res.redirect("/dashboard");
                    reserPasswordEmail(req.session.user.email, req.session.user.fullname);
                });
            }
        });
    }, (result, done) => {
        done();
    }], (err) => res.redirect('/')
    );
});

module.exports = router;
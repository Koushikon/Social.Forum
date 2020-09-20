const express = require("express");
const router = express.Router();

const auth = require("../../middlewares/auth.js");

// Set Chat Route
router.get("/", auth.checkLogin, (req, res) => {
  res.render("./dashboard/chat", {
    user: req.session.user,
    chat: req.session.chat
  });
});

router.get("/room-enter", auth.checkLogin, (req, res) => {
  res.render("./dashboard/room_enter", {
    watermark: 'social',
    url_1: 'deactive',
    url_2: 'deactive',
    url_3: 'deactive',
    url_4: 'deactive',
    user: req.session.user
  });
});

router.get("/room-enter/room", auth.checkLogin, (req, res) => {
  res.render("./dashboard/rooms", {
    user: req.session.user
  });
});

module.exports = router;

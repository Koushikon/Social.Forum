var express = require("express");
var router = express.Router();

const auth = require("../../middlewares/auth.js");
const Note = require("./../models/notes");

// View all Notes Route
router.get("/", auth.checkLogin, (req, res) => {
  Note.find()
    .then(results => {
      res.render("./dashboard/notes", {
        user: req.session.user,
        title: "Aroot User | List Notes",
        notes_list: results
      });
    })
    .catch(e => console.log(e));
});

// Add Notes Route
router.get("/add", auth.checkLogin, (req, res) => {
  res.render("./dashboard/notes_add", {
    title: "Aroot User | Add Notes"
  });
});

// Add Notes POST Route
router.post("/add", auth.checkLogin, (req, res) => {
  Note.create({
    author: req.session.user.username,
    privacy: req.body.privacy,
    title: req.body.title,
    subtitle: req.body.subtitle,
    description: req.body.description
  })
    .then(results => {
      Note.find()
        .then(results => {
          res.redirect("/notes");
          console.log("Note Created");
        })
        .catch(e => console.log(e));
    })
    .catch(e => {
      console.log(e);
    });
});

// Delete Note POST Route
router.post("/delete", auth.checkLogin, (req, res) => {
  Note.deleteOne({ _id: req.body.noteId }).then(results => {});
  res.redirect("/notes");
});

module.exports = router;

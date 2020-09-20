const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema({
  author: String,
  privacy: String,
  title: String,
  subtitle: String,
  description: String
}, { timestamps: true });

const Note = mongoose.model("Note", NoteSchema);

module.exports = Note;

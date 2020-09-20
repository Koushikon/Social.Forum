const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true
  },

  infos: {
    type: String,
    default: ""
  },

  usergender: {
    type: String,
    default: ""
  },

  userId: {
    type: String,
    default: "",
    unique: true,
    required: true
  },

  username: {
    type: String,
    unique: true,
    lowercase: true,
    required: true
  },

  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: true
  },

  userImg: {
    type: String
  },

  github: {
    type: String,
    lowercase: true,
    default: ""
  },

  youtube: {
    type: String,
    lowercase: true,
    default: ""
  },

  dateofbirth: {
    type: String,
    default: ""
  },

  age: {
    type: Number,
    default: ""
  },

  password: {
    type: String,
    required: true
  },

  resetPasswordToken: {
    type: String,
    default: ""
  },

  resetPasswordExpire: Date
}, { timestamps: true });

mongoose.model("User", userSchema);

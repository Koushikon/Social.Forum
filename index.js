const express = require("express");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const mongoStore = require("connect-mongo")(session);
const methodOverride = require("method-override");
const fs = require("fs");
const path = require("path");

require('dotenv').config();

// Store express configuration on server using app
const app = express();
// Call http library to create an server with express
const http = require("http").createServer(app);

// Socket.io Require (Here we write Signup & Chat)
require("./libs/chat.js").sockets(http);

// DB Configure
require('./app/config/database');

// HTTP Method-Override middleware
app.use(methodOverride((req, res) => {
  if (req.body && typeof req.body === "object" && "_method" in req.body) {
      var method = req.body._method;
      delete req.body._method;
      return method;
  }
}));

// Setup Static directory to serve up
app.use(express.static(path.join(__dirname, 'public')));
// For profile images
app.use('/uploads', express.static('uploads'));

// Setup EJS views engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//parsing middlewares
app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Express session
app.use(session({
  name: process.env.SESSION_NAME,
  secret: process.env.SESSION_SECRET,
  resave: true,
  httpOnly: true,
  saveUninitialized: true,
  store: new mongoStore({
    mongooseConnection: mongoose.connection
  }),
  cookie: {
    maxAge: 80 * 80 * 800
  }
}));

// Mongoose Models Set
fs.readdirSync("./app/models").forEach((file) => {
  if (file.indexOf(".js")) {
    require("./app/models/" + file);
  }
});

// Routes set
app.use('/', require('./app/controller/index'));
app.use('/user', require('./app/controller/signup'));
app.use('/user', require('./app/controller/login'));
app.use('/user', require('./app/controller/forgot'));
app.use('/dashboard', require('./app/controller/dashboard'));
app.use('/chat', require('./app/controller/messaging'));
app.use('/notes', require('./app/controller/notes'));

// Handling 4O4 error
app.use('*', (req, res) => {
  res.status(404).render('4O4', {
    title: "Page Not Found",
    url_1: 'deactive',
    url_2: 'deactive',
    url_3: 'deactive',
    url_4: 'deactive',
    redirect: "/",
    status: 404,
    watermark: '{{ PAGE NOT FOUND }}',
    error: "",
    user: req.session.user
  });
});

// App level middleware for setting logged in user
const userModel = mongoose.model("User");

app.use((req, res, next) => {
  if (req.session && req.session.user) {
    userModel.findOne({
      email: req.session.user.email
    }, (err, user) => {
      if (user) {
        req.user = user;
        delete req.user.password;
        req.session.user = user;
        delete req.session.user.password;
        next();
      }
    });
  } else {
      next();
  }
});

const PORT = process.env.PORT | 3000;
http.listen(PORT, console.log(`Server Listen on Port ${PORT}`));
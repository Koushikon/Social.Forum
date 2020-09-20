const express = require("express");
const mongoose = require("mongoose");

const { sendContactEmail } = require('../config/email');
const router = express.Router();
const contactModel = mongoose.model("Contact");

router.get('/', (req, res) => {
  res.render('index', {
    watermark: 'social',
    url_1: 'active',
    url_2: 'deactive',
    url_3: 'deactive',
    url_4: 'deactive',
    user: req.session.user
  });
});

// Set Technologies Page
router.get('/about', (req, res) => {
  res.render('about', {
    watermark: 'social',
    url_1: 'deactive',
    url_2: 'active',
    url_3: 'deactive',
    url_4: 'deactive',
    user: req.session.user
  });
});

// Set About Page
router.get('/technologies', (req, res) => {
  res.render('technologies', {
    watermark: 'social',
    url_1: 'deactive',
    url_2: 'deactive',
    url_3: 'active',
    url_4: 'deactive',
    user: req.session.user
  });
});

// Set Help Page
router.get('/help', (req, res) => {
  res.render('help', {
    watermark: 'social',
    url_1: 'deactive',
    url_2: 'deactive',
    url_3: 'deactive',
    url_4: 'active',
    user: req.session.user
  });
});

// Handling Help 4O4 error
router.get('/help/*', (req, res) => {
  res.status(404).render('4O4', {
    title: "Help Page Not Found",
    url_1: 'deactive',
    url_2: 'deactive',
    url_3: 'deactive',
    url_4: 'deactive',
    redirect: "/help",
    status: 404,
    watermark: '{{ HELP ARTICLE PAGE NOT FOUND }}',
    error: "",
    user: req.session.user
  });
});

router.post('/contact', (req, res) => {
  var today = Date.now();

  // Create user and accure data from body
  const newContact = new contactModel({
    the_name: req.body.the_name,
    email_id: req.body.email_id,
    phone_no: req.body.phone_no,
    the_msg: req.body.the_msg,
    createdAt: today,
    updatedAt: today
  });

  newContact.save((err, result) => {
    if (err) {
      throw err;

    } else if (!result) {

      res.status(404).render("4O4", {
        title: "Contact Not Sended",
        url_1: 'deactive',
        url_2: 'deactive',
        url_3: 'deactive',
        url_4: 'deactive',
        redirect: "/about",
        status: 404,
        watermark: '{{ The Message was not sended, Try Again... }}',
        error: "",
        user: req.session.user
      });

    } else {
      req.contact = result;
      res.send("The Messsage was Sended Sucessfully");
      sendContactEmail(req.body.email_id, req.body.the_name);
    }
  });

});

module.exports = router;
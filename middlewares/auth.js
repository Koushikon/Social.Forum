module.exports.checkLogin = (req, res, next) => {
  if (!req.user && !req.session.user) {
    res.redirect("/user/login");
  } else {
    next();
  }
};

module.exports.loggedIn = (req, res, next) => {
  if (!req.user && !req.session.user) {
    next();
  } else {
    res.redirect("/dashboard");
  }
};

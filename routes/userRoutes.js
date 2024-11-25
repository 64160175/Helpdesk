const express = require('express');
const router = express.Router();

// Middleware to check if user is logged in (ย้ายมาจาก index.js)
const isLoggedIn = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/');
  }
};

// Middleware to check user type (ย้ายมาจาก index.js)
const checkUserType = (type) => {
  return (req, res, next) => {
    if (req.session.user && req.session.user.u_type === type) {
      next();
    } else {
      res.status(403).render('403');
    }
  };
};

router.get('/UserHome', isLoggedIn, checkUserType('user'), (req, res) => {
  res.render('UserHome');
});

router.get('/UserRequest', isLoggedIn, checkUserType('user'), (req, res) => {
  res.render('UserRequest');
});

module.exports = router;
const express = require('express');
const router = express.Router();

const isLoggedIn = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/');
  }
};

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
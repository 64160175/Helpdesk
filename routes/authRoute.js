const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');


router.get('/', (req, res) => {
    res.render('login');
  });

router.post('/login', authController.login);


router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.log(err);
      }
      res.redirect('/');
    });
  });

module.exports = router;
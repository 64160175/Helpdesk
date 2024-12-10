const express = require('express');
const router = express.Router();

const { isLoggedIn, checkUserType } = require('../middlewares/authMiddleware');

router.get('/AdminRequestList', isLoggedIn, checkUserType('admin'), (req, res) => {
  res.render('AdminRequestList');
});

router.get('/AdminReport', isLoggedIn, checkUserType('admin'), (req, res) => {
  res.render('AdminReport');
});



module.exports = router;
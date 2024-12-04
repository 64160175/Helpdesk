const express = require('express');
const router = express.Router();

const { isLoggedIn, checkUserType } = require('../middlewares/authMiddleware');

router.get('/ManagerRequestList', isLoggedIn, checkUserType('manager'), (req, res) => {res.render('ManagerRequestList');});

module.exports = router;
const express = require('express');
const router = express.Router();
const { isLoggedIn, checkUserType } = require('../middlewares/authMiddleware');
const orderController = require('../controllers/orderController');

router.post('/createOrder', isLoggedIn, checkUserType('user'), orderController.createOrder);

module.exports = router;
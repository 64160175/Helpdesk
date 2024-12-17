const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Define the route for creating an order
router.post('/createOrder', orderController.createOrder);

module.exports = router;
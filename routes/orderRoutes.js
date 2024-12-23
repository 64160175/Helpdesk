const express = require('express');
const router = express.Router();
const { isLoggedIn, checkUserType } = require('../middlewares/authMiddleware');
const OrderController = require('../controllers/orderController');

router.post('/createOrder', isLoggedIn, checkUserType('user'), OrderController.createOrder);
router.get('/orderDetails/:id_order', OrderController.getOrderDetails);
router.get('/ManagerRequestList', isLoggedIn, checkUserType('manager'), OrderController.getManagerRequestList);

module.exports = router;
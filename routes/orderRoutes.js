const express = require('express');
const router = express.Router();
const { isLoggedIn, checkUserType } = require('../middlewares/authMiddleware');
const orderController = require('../controllers/orderController');

router.post('/createOrder', isLoggedIn, checkUserType('user'), orderController.createOrder);
router.get('/orderDetails/:id_order', orderController.getOrderDetails);
router.get('/ManagerRequestList', isLoggedIn, checkUserType('manager'), orderController.getManagerRequestList);

module.exports = router;
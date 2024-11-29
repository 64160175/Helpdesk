const express = require('express');
const { isLoggedIn, checkUserType } = require('../middlewares/authMiddleware');
const itemController = require('../controllers/itemController');
const router = express.Router();

// ... other routes ...

router.get('/AdminItem', isLoggedIn, checkUserType('admin'), itemController.getAllItems);

module.exports = router;
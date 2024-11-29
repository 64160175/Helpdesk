const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const ItemController = require('../controllers/itemController');
const { isLoggedIn, checkUserType } = require('../middlewares/authMiddleware');

// Route สำหรับหน้าคลังอุปกรณ์ทั้งหมด
router.get('/AdminAllStock', isLoggedIn, checkUserType('admin'), (req, res) => {res.render('AdminAllStock');});

// Route สำหรับหน้าสร้างวัสดุทั่วไป
router.get('/AdminItem', isLoggedIn, checkUserType('admin'), ItemController.getAdminItemPage);
router.post('/admin/add-item', isLoggedIn, checkUserType('admin'), upload.single('itemPicture'), ItemController.addItem);
// Route สำหรับเพิ่มเครื่องปริ้นเตอร์




module.exports = router;
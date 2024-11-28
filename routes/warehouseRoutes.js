const express = require('express');
const router = express.Router();

// นำเข้า middleware จากไฟล์ที่เหมาะสม
const { isLoggedIn, checkUserType } = require('../middlewares/authMiddleware');

// Route สำหรับหน้าคลังอุปกรณ์ทั้งหมด
router.get('/AdminItem', isLoggedIn, checkUserType('admin'), (req, res) => {
    res.render('AdminItem');  // ชื่อไฟล์ EJS ที่ต้องการแสดง
});

// Route สำหรับหน้าสร้างเครื่องปริ้นเตอร์
router.get('/create-printer', isLoggedIn, checkUserType('admin'), (req, res) => {
    res.render('CreatePrinter');  // สร้างไฟล์ EJS นี้ถ้ายังไม่มี
});

// Route สำหรับหน้าสร้างวัสดุทั่วไป
router.get('/create-material', isLoggedIn, checkUserType('admin'), (req, res) => {
    res.render('CreateMaterial');  // สร้างไฟล์ EJS นี้ถ้ายังไม่มี
});

// เพิ่ม routes อื่นๆ ที่เกี่ยวข้องกับคลังสินค้าตามต้องการ

module.exports = router;
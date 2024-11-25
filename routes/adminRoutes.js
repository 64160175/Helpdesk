const express = require('express');
const router = express.Router();

// นำเข้า middleware จากไฟล์ที่เหมาะสม (อาจต้องปรับเส้นทางการ import ตามโครงสร้างโปรเจคของคุณ)
const { isLoggedIn, checkUserType } = require('../middlewares/authMiddleware');

router.get('/AdminRequestList', isLoggedIn, checkUserType('admin'), (req, res) => {
  res.render('AdminRequestList');
});

module.exports = router;
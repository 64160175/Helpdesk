const express = require('express');
const router = express.Router();
const MemberController = require('../controllers/memberController');
const { isLoggedIn, checkUserType } = require('../middlewares/authMiddleware');


// Route สำหรับดูรายชื่อสมาชิกทั้งหมด
router.get('/AdminAllMember', isLoggedIn, checkUserType('admin'), MemberController.getAllMembers);

// Route สำหรับลบผู้ใช้
router.post('/deleteUser', isLoggedIn, checkUserType('admin'), MemberController.deleteUser);

// Route สำหรับเพิ่มผู้ใช้ใหม่
router.get('/AdminAddMember', isLoggedIn, checkUserType('admin'), MemberController.getAddMemberForm);
router.post('/addMember', isLoggedIn, checkUserType('admin'), MemberController.addMember);

module.exports = router;
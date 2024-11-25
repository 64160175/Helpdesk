const express = require('express');
const router = express.Router();
const MemberController = require('../controllers/memberController');

router.get('/AdminAllMember', MemberController.getAllMembers);
router.post('/deleteUser', MemberController.deleteUser);

module.exports = router;
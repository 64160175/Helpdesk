const express = require('express');
const router = express.Router();
const MemberController = require('../controllers/memberController');

router.get('/AdminAllMember', MemberController.getAllMembers);

module.exports = router;
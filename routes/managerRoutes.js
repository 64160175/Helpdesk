const db = require('../db');
const express = require('express');
const router = express.Router();
const { isLoggedIn, checkUserType } = require('../middlewares/authMiddleware');
const OrderController = require('../controllers/orderController');

router.post('/approveRequestByManager', isLoggedIn, checkUserType('manager'), OrderController.approveRequestByManager);

router.get('/ManagerRequestList', isLoggedIn, checkUserType('manager'), (req, res) => {
    // ดึงข้อมูลแผนกของผู้ใช้
    const query = 'SELECT section FROM tbl_emp_section WHERE id_emp_section = ?';
    db.query(query, [req.session.user.id_emp_section], (err, results) => {
        if (err) {
            console.error('Error fetching section:', err);
            return res.status(500).send('Internal Server Error');
        }
        const sectionName = results[0] ? results[0].section : 'ไม่ระบุ';
        res.render('ManagerRequestList', {
            user: req.session.user,
            sectionName: sectionName
        });
    });
});

module.exports = router;
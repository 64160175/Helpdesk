const express = require('express');
const router = express.Router();

const db = require('../db');

const { isLoggedIn, checkUserType } = require('../middlewares/authMiddleware');

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
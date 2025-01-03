const db = require('../db');

const User = {
  // ยืนยันชื่อผู้ใช้งานว่ามีอยู่หรือไม่ และส่งข้อมูลผู้ใช้งานกลับ #ใช้หน้า login
  findByUsername: (username, callback) => {
    const query = 'SELECT * FROM tbl_user WHERE u_name = ?';
    db.query(query, [username], (err, results) => {
      if (err) {
        return callback(err, null);
      }
      return callback(null, results[0]);
    });
  }
};

module.exports = User;
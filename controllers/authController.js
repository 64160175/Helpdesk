const User = require('../models/authModel');

exports.login = (req, res) => {
  const { username, password } = req.body;

  User.findByUsername(username, (err, user) => {
    if (err) {
      return res.render('login', { error: 'เกิดข้อผิดพลาดในระบบ กรุณาลองใหม่อีกครั้ง' });
    }

    if (!user) {
      return res.render('login', { error: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
    }

    if (user.u_pass !== password) {
      return res.render('login', { error: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
    }

    if (user.u_status !== 'active') {
      return res.render('login', { error: 'บัญชีผู้ใช้ไม่ได้เปิดใช้งาน กรุณาติดต่อผู้ดูแลระบบ' });
    }

    // Store user information in session
    req.session.user = user;

    switch (user.u_type) {
      case 'admin':
        return res.redirect('/AdminRequestList');
      case 'manager':
        return res.redirect('/ManagerRequestList');
      case 'user':
        return res.redirect('/UserHome');
      default:
        return res.render('login', { error: 'ไม่มีสิทธิ์เข้าถึง กรุณาติดต่อผู้ดูแลระบบ' });
    }
  });
};
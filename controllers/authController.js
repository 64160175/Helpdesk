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
    req.session.user = {
      id_user: user.id_user,
      username: user.username,
      f_name: user.f_name,
      l_name: user.l_name,
      u_type: user.u_type,
      id_emp_section: user.id_emp_section,
      u_status: user.u_status,
      email: user.email
    };

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
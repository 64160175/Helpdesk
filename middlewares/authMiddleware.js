// เช็คว่า user ได้ login หรือยัง ถ้าไม่ได้ login จะส่งไปหน้า login
exports.isLoggedIn = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/');
  }
};

// เช็คว่า user มีบทบาทเป็นอะไร ถ้าไม่ใช่จะส่งไปหน้า 403
exports.checkUserType = (type) => {
  return (req, res, next) => {
    if (req.session.user && req.session.user.u_type === type) {
      next();
    } else {
      res.status(403).render('403');
    }
  };
};
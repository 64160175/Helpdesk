const User = require('../models/authModel');

exports.login = (req, res) => {
  const { username, password } = req.body;

  User.findByUsername(username, (err, user) => {
    if (err) {
      return res.status(500).send('Internal Server Error');
    }

    if (!user) {
      return res.status(401).send('Invalid username or password');
    }

    if (user.u_pass !== password) {
      return res.status(401).send('Invalid username or password');
    }

    if (user.u_status !== 'active') {
      return res.status(403).send('Account is not active');
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
        return res.status(403).send('Access Denied');
    }
  });
};
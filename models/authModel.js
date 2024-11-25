const db = require('../db');

const User = {
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
const db = require('../config/database');

const LoginModel = {
  authenticateUser: (username, password) => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT u_id, u_name, f_name, l_name, u_mail, dept_id, role_id 
        FROM tbl_users 
        WHERE u_name = ? AND u_pass = ?
      `;
      db.query(query, [username, password], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results.length > 0 ? results[0] : null);
        }
      });
    });
  },

  getUserById: (userId) => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT u_id, u_name, f_name, l_name, u_mail, dept_id, role_id 
        FROM tbl_users 
        WHERE u_id = ?
      `;
      db.query(query, [userId], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results.length > 0 ? results[0] : null);
        }
      });
    });
  }
};

module.exports = LoginModel;
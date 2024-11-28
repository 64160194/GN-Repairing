const db = require('../config/database');

const UserHomeModel = {
  getUserInfo: (userId) => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT u.u_id, u.u_name, u.f_name, u.l_name, u.dept_id, d.dept_name
        FROM tbl_users u
        LEFT JOIN tbl_dept d ON u.dept_id = d.dept_id
        WHERE u.u_id = ?
      `;
      
      db.query(query, [userId], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results.length > 0 ? results[0] : null);
        }
      });
    });
  },

  getAllUsers: () => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT u.u_id, u.u_name, u.f_name, u.l_name, u.dept_id, d.dept_name
        FROM tbl_users u
        LEFT JOIN tbl_dept d ON u.dept_id = d.dept_id
        ORDER BY u.u_id
      `;
      
      db.query(query, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  },

  getUserById: (userId) => {
    return UserHomeModel.getUserInfo(userId);
  },

  getRequests: (userId) => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT req_id, repair_item, repair_type, date_time
        FROM tbl_requests
        WHERE u_id = ?
        ORDER BY date_time DESC
        LIMIT 10
      `;
      
      db.query(query, [userId], (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results);
      });
    });
  }

};

module.exports = UserHomeModel;
const db = require('../config/database');

const memberUserModel = {
  getAllMembers: (deptId) => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT u.u_id, u.u_name, u.u_mail, u.f_name, u.l_name, 
               d.dept_name, r.role_name
        FROM tbl_users u
        LEFT JOIN tbl_dept d ON u.dept_id = d.dept_id
        LEFT JOIN tbl_role r ON u.role_id = r.role_id
        WHERE u.dept_id = ?
      `;
      db.query(query, [deptId], (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results);
      });
    });
  },

  getMemberById: (userId) => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT u.u_id, u.u_name, u.u_mail, u.f_name, u.l_name, 
               u.dept_id, u.role_id, d.dept_name, r.role_name
        FROM tbl_users u
        LEFT JOIN tbl_dept d ON u.dept_id = d.dept_id
        LEFT JOIN tbl_role r ON u.role_id = r.role_id
        WHERE u.u_id = ?
      `;
      db.query(query, [userId], (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results[0]);
      });
    });
  }
};

module.exports = memberUserModel;
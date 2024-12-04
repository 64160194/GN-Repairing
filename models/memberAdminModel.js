const db = require('../config/database');

const MemberAdminModel = {
  getAllMembers: () => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT u.*, d.dept_name, r.role_name 
        FROM tbl_users u
        LEFT JOIN tbl_dept d ON u.dept_id = d.dept_id
        LEFT JOIN tbl_role r ON u.role_id = r.role_id
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

  addMember: (username, password, firstName, lastName, roleId) => {
    return new Promise((resolve, reject) => {
      const query = 'INSERT INTO tbl_users (u_name, u_pass, f_name, l_name, role_id) VALUES (?, ?, ?, ?, ?)';
      db.query(query, [username, password, firstName, lastName, roleId], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  },

  updateMember: (id, username, firstName, lastName, roleId) => {
    return new Promise((resolve, reject) => {
      const query = 'UPDATE tbl_users SET u_name = ?, f_name = ?, l_name = ?, role_id = ? WHERE u_id = ?';
      db.query(query, [username, firstName, lastName, roleId, id], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  },

  deleteMember: (id) => {
    return new Promise((resolve, reject) => {
      const query = 'DELETE FROM tbl_users WHERE u_id = ?';
      db.query(query, [id], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  }
};

module.exports = MemberAdminModel;
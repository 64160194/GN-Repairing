const db = require('../config/database');

const MemberAdminModel = {
  getAllMembers: () => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT u.*, d.dept_name, r.role_name 
        FROM tbl_users u
        LEFT JOIN tbl_dept d ON u.dept_id = d.dept_id
        LEFT JOIN tbl_role r ON u.role_id = r.role_id
        WHERE u.u_status = 1
        ORDER BY u.u_name ASC
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
  
  getLastUserId: () => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT MAX(u_id) as lastId FROM tbl_users';
      db.query(query, (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results[0].lastId || 0);
      });
    });
  },

  addMember: async (memberData) => {
    try {
      const lastId = await MemberAdminModel.getLastUserId();
      const newId = lastId + 1;

      return new Promise((resolve, reject) => {
        const query = `
          INSERT INTO tbl_users (u_id, u_name, u_pass, u_mail, f_name, l_name, dept_id, role_id, u_status)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
        `;
        const values = [
          newId,
          memberData.u_name,
          memberData.u_pass,
          memberData.u_mail,
          memberData.f_name,
          memberData.l_name,
          memberData.dept_id,
          memberData.role_id
        ];

        db.query(query, values, (error, results) => {
          if (error) {
            return reject(error);
          }
          resolve({ ...results, insertId: newId });
        });
      });
    } catch (error) {
      throw error;
    }
  },

  updateMemberDepartment: (id, deptId) => {
    return new Promise((resolve, reject) => {
      const query = 'UPDATE tbl_users SET dept_id = ? WHERE u_id = ?';
      db.query(query, [deptId, id], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  },

  updateMemberStatus: (userId, status) => {
    return new Promise((resolve, reject) => {
      const query = 'UPDATE tbl_users SET u_status = ? WHERE u_id = ?';
      db.query(query, [status, userId], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results.affectedRows > 0);
        }
      });
    });
  },

  deleteMember: (id) => {
    return new Promise((resolve, reject) => {
      const query = 'UPDATE tbl_users SET u_status = 0 WHERE u_id = ?';
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
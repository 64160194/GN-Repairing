const db = require('../config/database');

const requestMgrModel = {
  getRequestsByDepartment: (deptId) => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT r.req_id, r.u_id, r.repair_item, r.location_n, r.repair_type, r.date_time,
               u.dept_id, u.f_name, u.l_name
        FROM tbl_requests r
        JOIN tbl_users u ON r.u_id = u.u_id
        WHERE u.dept_id = ?
        ORDER BY r.date_time DESC
      `;
      
      db.query(query, [deptId], (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results);
      });
    });
  },

  getUserInfo: (userId) => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT u_id, f_name, l_name, u_mail, dept_id
        FROM tbl_users
        WHERE u_id = ?
      `;
      
      db.query(query, [userId], (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results[0] || null);
      });
    });
  },

  getRequestDetails: (requestId) => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT r.*, u.f_name, u.l_name, u.u_mail, d.dept_name
        FROM tbl_requests r
        JOIN tbl_users u ON r.u_id = u.u_id
        JOIN tbl_dept d ON u.dept_id = d.dept_id
        WHERE r.req_id = ?
      `;
      
      db.query(query, [requestId], (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results[0] || null);
      });
    });
  },

  updateRequestStatus: (requestId, status) => {
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE tbl_requests
        SET status = ?
        WHERE req_id = ?
      `;
      
      db.query(query, [status, requestId], (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result.affectedRows > 0);
      });
    });
  }
};

module.exports = requestMgrModel;
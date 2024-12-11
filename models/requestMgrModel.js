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
        SELECT u.u_id, u.u_name, u.f_name, u.l_name, u.u_mail, d.dept_name
        FROM tbl_users u
        LEFT JOIN tbl_dept d ON u.dept_id = d.dept_id
        WHERE u.u_id = ?
      `;
      
      db.query(query, [userId], (error, results) => {
        if (error) {
          return reject(error);
        }
        if (results.length === 0) {
          return resolve(null);
        }
        resolve(results[0]);
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

  updateRequestStatus: (req_id, status) => {
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE tbl_requests
        SET status = ?
        WHERE req_id = ?
      `;
      
      db.query(query, [status, req_id], (error, results) => {
        if (error) {
          console.error('Error in updateRequestStatus:', error);
          return reject(error);
        }
        resolve(results.affectedRows > 0);
      });
    });
  },

  getRequestById: (requestId) => {
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
        if (results.length === 0) {
          return reject(new Error('Request not found'));
        }
        resolve(results[0]);
      });
    });
  },

  saveApproval: (req_id, mgr_id, is_approved, role) => {
    return new Promise((resolve, reject) => {
      let approveField;
      switch (role) {
        case 'mgr':
          approveField = 'app_mgr';
          break;
        case 'hrga':
          approveField = 'app_hrga';
          break;
        case 'admin':
          approveField = 'app_admin';
          break;
        default:
          return reject(new Error('Invalid role'));
      }
  
      const query = `
        INSERT INTO tbl_approve (req_id, ${approveField}, approve_status, approve_date)
        VALUES (?, ?, ?, NOW())
      `;
      db.query(query, [req_id, mgr_id, is_approved ? 1 : 0], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results.insertId);
        }
      });
    });
  },
  
  updateRequestStatus: (req_id, approve_id, status) => {
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE tbl_requests
        SET approve_id = ?, status = ?
        WHERE req_id = ?
      `;
      db.query(query, [approve_id, status, req_id], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results.affectedRows > 0);
        }
      });
    });
  },
};

module.exports = requestMgrModel;
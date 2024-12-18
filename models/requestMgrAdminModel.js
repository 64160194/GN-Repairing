const db = require('../config/database');

const RequestMgrAdminModel = {
  getAllApprovedRequests: () => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT r.*, u.f_name, u.l_name, d.dept_name, a.app_mgr, a.app_hrga
        FROM tbl_requests r
        JOIN tbl_users u ON r.u_id = u.u_id
        JOIN tbl_dept d ON u.dept_id = d.dept_id
        JOIN tbl_approve a ON r.approve_id = a.approve_id
        WHERE a.app_mgr = 'approve'
        ORDER BY r.date_time DESC
      `;

      db.query(query, (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results);
      });
    });
  },

  getRequestById: (requestId) => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT r.*, u.f_name, u.l_name, u.u_mail, d.dept_name, a.app_mgr, a.app_hrga
        FROM tbl_requests r
        JOIN tbl_users u ON r.u_id = u.u_id
        JOIN tbl_dept d ON u.dept_id = d.dept_id
        JOIN tbl_approve a ON r.approve_id = a.approve_id
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

  updateApprovalStatus: (reqId, status) => {
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE tbl_approve a
        JOIN tbl_requests r ON a.approve_id = r.approve_id
        SET a.app_hrga = ?
        WHERE r.req_id = ?
      `;
      
      db.query(query, [status, reqId], (error, results) => {
        if (error) {
          console.error('Error in updateApprovalStatus:', error);
          return reject(error);
        }
        resolve(results.affectedRows > 0);
      });
    });
  },

  getRequestsAwaitingHRGAApproval: () => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT r.*, u.f_name, u.l_name, d.dept_name, a.app_mgr, a.app_hrga
        FROM tbl_requests r
        JOIN tbl_users u ON r.u_id = u.u_id
        JOIN tbl_dept d ON u.dept_id = d.dept_id
        JOIN tbl_approve a ON r.approve_id = a.approve_id
        WHERE a.app_mgr = 'approve' AND a.app_hrga IS NULL
        ORDER BY r.date_time DESC
      `;

      db.query(query, (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results);
      });
    });
  },

  updateRequestStatus: (reqId, status) => {
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE tbl_requests
        SET req_status = ?
        WHERE req_id = ?
      `;
      
      db.query(query, [status, reqId], (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results.affectedRows > 0);
      });
    });
  },

  // Add more model methods as needed
};

module.exports = RequestMgrAdminModel;
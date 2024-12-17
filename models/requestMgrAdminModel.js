const db = require('../config/database');

const RequestMgrAdminModel = {
  getAllApprovedRequests: () => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT r.*, u.f_name, u.l_name, d.dept_name, a.app_mgr
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
        SELECT r.*, u.f_name, u.l_name, u.u_mail, d.dept_name, a.app_mgr
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

  // Add more model methods as needed
};

module.exports = RequestMgrAdminModel;
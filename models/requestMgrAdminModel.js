const db = require('../config/database');

const RequestMgrAdminModel = {
  getAllRequests: () => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT r.*, u.u_name, d.dept_name, rt.role_name
        FROM tbl_requests r
        JOIN tbl_users u ON r.u_id = u.u_id
        JOIN tbl_dept d ON u.dept_id = d.dept_id
        JOIN tbl_role rt ON u.role_id = rt.role_id
        WHERE d.dept_id = 1  -- Assuming 1 is the department ID for HR&GA
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

  // Add more model methods as needed
};

module.exports = RequestMgrAdminModel;
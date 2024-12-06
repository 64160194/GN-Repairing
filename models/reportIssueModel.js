const db = require('../config/database');

const ReportIssueModel = {
  getReports: () => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT r.*, u.u_name, u.f_name, u.l_name, d.dept_name
        FROM tbl_requests r
        JOIN tbl_users u ON r.u_id = u.u_id
        JOIN tbl_dept d ON u.dept_id = d.dept_id
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

  generateReport: (startDate, endDate) => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT r.*, u.u_name, u.f_name, u.l_name, d.dept_name
        FROM tbl_requests r
        JOIN tbl_users u ON r.u_id = u.u_id
        JOIN tbl_dept d ON u.dept_id = d.dept_id
        WHERE r.date_time BETWEEN ? AND ?
        ORDER BY r.date_time DESC
      `;
      
      db.query(query, [startDate, endDate], (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results);
      });
    });
  }
};

module.exports = ReportIssueModel;
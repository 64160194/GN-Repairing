const db = require('../config/database');

const reportIssueModel = {
  getRepairTypeCounts: () => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT repair_type, COUNT(*) as count
        FROM tbl_requests
        GROUP BY repair_type
      `;

      db.query(query, (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results);
      });
    });
  },

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

  getReportsByDateRange: (startDate, endDate) => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT *
        FROM tbl_requests
        WHERE date_time BETWEEN ? AND ?
        ORDER BY date_time DESC
      `;

      db.query(query, [startDate, endDate], (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results);
      });
    });
  },

  getReportsByDepartment: () => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT d.dept_name, COUNT(*) as count
        FROM tbl_requests r
        JOIN tbl_users u ON r.u_id = u.u_id
        JOIN tbl_dept d ON u.dept_id = d.dept_id
        GROUP BY d.dept_id, d.dept_name
      `;

      db.query(query, (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results);
      });
    });
  },

  getRepairTypeCounts: (month, year) => {
    return new Promise((resolve, reject) => {
        let query = `
            SELECT repair_type, COUNT(*) as count
            FROM tbl_requests
            WHERE 1=1
        `;
        const params = [];

        if (month) {
            query += ` AND MONTH(date_time) = ?`;
            params.push(month);
        }
        if (year) {
            query += ` AND YEAR(date_time) = ?`;
            params.push(year);
        }

        query += ` GROUP BY repair_type`;

        db.query(query, params, (error, results) => {
            if (error) {
                return reject(error);
            }
            resolve(results);
        });
    });
}
};

module.exports = reportIssueModel;
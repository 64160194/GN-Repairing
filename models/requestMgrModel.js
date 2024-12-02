const db = require('../config/database');

const requestMgrModel = {
  getAllRequests: () => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT r.*, u.f_name, u.l_name
        FROM tbl_requests r
        JOIN tbl_users u ON r.u_id = u.u_id
        ORDER BY r.date_time DESC
      `;
      
      db.query(query, (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results);
      });
    });
  }
};

module.exports = requestMgrModel;
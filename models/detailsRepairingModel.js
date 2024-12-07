const db = require('../config/database');

const detailsRepairingModel = {
  getRepairDetails: (req_id) => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT r.*, u.f_name, u.l_name, u.u_mail, d.dept_name,
               r.r_pic1, r.r_pic2, r.r_pic3
        FROM tbl_requests r
        JOIN tbl_users u ON r.u_id = u.u_id
        JOIN tbl_dept d ON u.dept_id = d.dept_id
        WHERE r.req_id = ?
      `;
      db.query(query, [req_id], (error, results) => {
        if (error) {
          return reject(error);
        }
        if (results.length === 0) {
          return resolve(null);
        }
        const result = results[0];
        // แปลง BLOB เป็น Base64 string
        ['r_pic1', 'r_pic2', 'r_pic3'].forEach(pic => {
          if (result[pic]) {
            result[pic] = result[pic].toString('base64');
          }
        });
        resolve(result);
      });
    });
  }
};

module.exports = detailsRepairingModel;
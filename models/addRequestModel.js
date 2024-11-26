const db = require('../config/database');

const addRequestModel = {
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

  addRequest: (requestData) => {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO tbl_requests 
        (u_id, repair_item, sympton_def, location_n, repair_type, other_type, r_pic1, r_pic2, date_time)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
      `;

      const values = [
        requestData.u_id,
        requestData.repair_item,
        requestData.sympton_def,
        requestData.location_n,
        requestData.repair_type,
        requestData.other_type,
        requestData.r_pic1,
        requestData.r_pic2
      ];

      db.query(query, values, (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results.insertId);
      });
    });
  } ,
  
};


module.exports = addRequestModel;
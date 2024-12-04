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

  getMaxRequestId: () => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT MAX(req_id) as maxId FROM tbl_requests';
      db.query(query, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results[0].maxId || 0);
        }
      });
    });
  },

  addRequest: async (requestData) => {
    try {
      const maxId = await addRequestModel.getMaxRequestId();
      const newId = maxId + 1;

      return new Promise((resolve, reject) => {
        const query = `
          INSERT INTO tbl_requests 
          (req_id, u_id, repair_item, sympton_def, location_n, repair_type, other_type, r_pic1, r_pic2, r_pic3, date_time)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
        `;

        const values = [
          newId,
          requestData.u_id,
          requestData.repair_item,
          requestData.sympton_def,
          requestData.location_n,
          requestData.repair_type,
          requestData.other_type,
          requestData.r_pic1,
          requestData.r_pic2,
          requestData.r_pic3
        ];

        db.query(query, values, (error, results) => {
          if (error) {
            console.error('Error in addRequest:', error);
            reject(error);
          } else {
            resolve(newId);
          }
        });
      });
    } catch (error) {
      console.error('Error in getMaxRequestId:', error);
      throw error;
    }
  }
};

module.exports = addRequestModel;
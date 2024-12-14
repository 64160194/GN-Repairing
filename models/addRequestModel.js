const db = require('../config/database');
const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "64160194@go.buu.ac.th",
      pass: "fltv pagw ndou bjmi",
    },
  });

  let info = await transporter.sendMail({
    from: '"General Repairing System" <your-email@example.com>',
    to: to,
    subject: subject,
    text: text,
  });

  console.log("Message sent: %s", info.messageId);
};

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

  createApproveRecord: () => {
    return new Promise((resolve, reject) => {
      // First, get the maximum approve_id
      const getMaxIdQuery = 'SELECT MAX(approve_id) as maxId FROM tbl_approve';
      db.query(getMaxIdQuery, (error, results) => {
        if (error) {
          console.error('Error getting max approve_id:', error);
          return reject(error);
        }
  
        const newId = (results[0].maxId || 0) + 1;
  
        // Now insert the new record with the new ID
        const insertQuery = `
          INSERT INTO tbl_approve (approve_id, app_mgr, app_hrga, app_admin) 
          VALUES (?, NULL, NULL, NULL)
        `;
        db.query(insertQuery, [newId], (error, results) => {
          if (error) {
            console.error('Error in createApproveRecord:', error);
            reject(error);
          } else {
            resolve(newId);
          }
        });
      });
    });
  },

  createWorkerRecord: () => {
    return new Promise((resolve, reject) => {
      // First, get the maximum worker_id
      const getMaxIdQuery = 'SELECT MAX(worker_id) as maxId FROM tbl_worker';
      db.query(getMaxIdQuery, (error, results) => {
        if (error) {
          console.error('Error getting max worker_id:', error);
          return reject(error);
        }
  
        const newId = (results[0].maxId || 0) + 1;
  
        // Now insert the new record with the new ID
        const insertQuery = `
          INSERT INTO tbl_worker 
          (worker_id, survey_results, edit_details, date_by, finish_time, edit_by, budget_by) 
          VALUES (?, NULL, NULL, NULL, NULL, NULL, NULL)
        `;
        db.query(insertQuery, [newId], (error, results) => {
          if (error) {
            console.error('Error in createWorkerRecord:', error);
            reject(error);
          } else {
            resolve(newId);
          }
        });
      });
    });
  },

  addRequest: async (requestData) => {
    try {
      const maxId = await addRequestModel.getMaxRequestId();
      const newId = maxId + 1;
      const approveId = await addRequestModel.createApproveRecord();
      const workerId = await addRequestModel.createWorkerRecord();

      return new Promise((resolve, reject) => {
        const query = `
          INSERT INTO tbl_requests 
          (req_id, u_id, repair_item, sympton_def, location_n, repair_type, other_type, r_pic1, r_pic2, r_pic3, date_time, approve_id, worker_id)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?)
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
          requestData.r_pic3,
          approveId,
          workerId
        ];

        db.query(query, values, async (error, results) => {
          if (error) {
            console.error('Error in addRequest:', error);
            reject(error);
          } else {
            // ส่งอีเมลแจ้งเตือนหัวหน้าแผนก
            try {
              const user = await addRequestModel.getUserById(requestData.u_id);
              const manager = await addRequestModel.getDepartmentManager(user.dept_id);
              if (manager && manager.u_mail) {
                const subject = "แจ้งเตือน: มีคำขอซ่อมใหม่";
                const text = `มีคำขอซ่อมใหม่จาก ${user.f_name} ${user.l_name} แผนก ${user.dept_name}\nรายละเอียด: ${requestData.repair_item}\nอาการ: ${requestData.sympton_def}\nสถานที่: ${requestData.location_n}`;
                await sendEmail(manager.u_mail, subject, text);
              }
            } catch (emailError) {
              console.error('Error sending email:', emailError);
            }
            resolve(newId);
          }
        });
      });
    } catch (error) {
      console.error('Error in addRequest:', error);
      throw error;
    }
  },

  getUserById: (userId) => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT u.u_id, u.f_name, u.l_name, u.dept_id, d.dept_name
        FROM tbl_users u
        LEFT JOIN tbl_dept d ON u.dept_id = d.dept_id
        WHERE u.u_id = ?
      `;
      db.query(query, [userId], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results.length > 0 ? results[0] : null);
        }
      });
    });
  },

  getManagerByDeptId: (deptId) => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT u.u_id, u.f_name, u.l_name, u.u_mail
        FROM tbl_users u
        WHERE u.dept_id = ? AND u.role_id = 4
        LIMIT 1
      `;
      db.query(query, [deptId], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results.length > 0 ? results[0] : null);
        }
      });
    });
  },

  getDepartmentManager: (deptId) => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT u.u_mail
        FROM tbl_users u
        WHERE u.dept_id = ? AND u.role_id = 4
        LIMIT 1
      `;
      db.query(query, [deptId], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results.length > 0 ? results[0] : null);
        }
      });
    });
  }

};

module.exports = addRequestModel;
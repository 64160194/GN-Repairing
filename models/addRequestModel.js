const db = require('../config/database');
const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, html) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "64160194@go.buu.ac.th",
      pass: "fltv pagw ndou bjmi",
    },
  });

  let info = await transporter.sendMail({
    from: '"General Repairing System" <your-email@example.com>',
    to: to,
    subject: subject,
    html: html,
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
      const getMaxIdQuery = 'SELECT MAX(approve_id) as maxId FROM tbl_approve';
      db.query(getMaxIdQuery, (error, results) => {
        if (error) {
          console.error('Error getting max approve_id:', error);
          return reject(error);
        }
  
        const newId = (results[0].maxId || 0) + 1;
  
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
      const getMaxIdQuery = 'SELECT MAX(worker_id) as maxId FROM tbl_worker';
      db.query(getMaxIdQuery, (error, results) => {
        if (error) {
          console.error('Error getting max worker_id:', error);
          return reject(error);
        }
  
        const newId = (results[0].maxId || 0) + 1;
  
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
            try {
              const user = await addRequestModel.getUserById(requestData.u_id);
              const manager = await addRequestModel.getDepartmentManager(user.dept_id);
              if (manager && manager.u_mail) {
                const subject = "แจ้งเตือน: มีคำขอซ่อมใหม่";
                const html = `
                  <html>
                    <head>
                      <meta charset="UTF-8">
                      <link href="https://fonts.googleapis.com/css2?family=Kanit:wght@400;700&display=swap" rel="stylesheet">
                      <style>
                        body { 
                          font-family: 'Kanit', sans-serif; 
                          line-height: 1.6; 
                          color: #333; 
                          background-color: #f6f6f6;
                          margin: 0;
                          padding: 0;
                        }
                        .container { 
                          width: 100%; 
                          max-width: 600px; 
                          margin: 0 auto; 
                          background-color: #ffffff;
                          box-shadow: 0 0 10px rgba(0,0,0,0.1);
                        }
                        .header { 
                          background-color: #007bff; 
                          color: #ffffff;
                          padding: 20px; 
                          text-align: center; 
                        }
                        .content { padding: 30px; }
                        .footer { 
                          background-color: #f8f9fa; 
                          color: #6c757d;
                          padding: 15px; 
                          text-align: center; 
                          font-size: 14px; 
                        }
                        table { 
                          width: 100%; 
                          border-collapse: separate; 
                          border-spacing: 0 10px;
                        }
                        th, td { 
                          padding: 12px; 
                          text-align: left;
                          border-bottom: 1px solid #dee2e6; 
                        }
                        th { 
                          background-color: #e9ecef; 
                          font-weight: bold; 
                          color: #495057;
                        }
                        .button { 
                          display: inline-block; 
                          padding: 12px 24px; 
                          background-color: #28a745; 
                          color: #ffffff !important; 
                          text-decoration: none; 
                          border-radius: 5px; 
                          font-weight: bold;
                          text-align: center;
                          transition: background-color 0.3s ease;
                        }
                        .button:hover {
                          background-color: #218838;
                        }
                        .section-title {
                          border-bottom: 2px solid #007bff;
                          padding-bottom: 10px;
                          margin-top: 30px;
                          color: #007bff;
                        }
                      </style>
                    </head>
                    <body>
                      <div class="container">
                        <div class="header">
                          <h1 style="margin: 0;">แจ้งเตือน: มีคำขอซ่อมใหม่</h1>
                        </div>
                        <div class="content">
                          <h2 class="section-title">ข้อมูลผู้แจ้งซ่อม</h2>
                          <table>
                            <tr><th>ชื่อ-นามสกุล:</th><td>${user.f_name} ${user.l_name}</td></tr>
                            <tr><th>แผนก:</th><td>${user.dept_name}</td></tr>
                          </table>
                          
                          <h2 class="section-title">รายละเอียดการแจ้งซ่อม</h2>
                          <table>
                            <tr><th>อุปกรณ์ที่ต้องการซ่อม:</th><td>${requestData.repair_item}</td></tr>
                            <tr><th>อาการ:</th><td>${requestData.sympton_def}</td></tr>
                            <tr><th>สถานที่:</th><td>${requestData.location_n}</td></tr>
                          </table>

                          <p style="text-align: center; margin-top: 30px;">
                            <a href="http://localhost:3000/" class="button">กดเพื่อดำเนินการต่อ</a>
                          </p>
                        </div>
                        <div class="footer">
                          <p>หากมีข้อสงสัยกรุณาติดต่อฝ่าย IT | © ${new Date().getFullYear()} MINIBEA ACCESSOLUTIONS THAI LTD.</p>
                        </div>
                      </div>
                    </body>
                  </html>
                `;
                await sendEmail(manager.u_mail, subject, html);
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
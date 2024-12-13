const db = require('../config/database');

const ApprovalStatus = {
  APPROVE: 'approve',
  REJECT: 'reject'
};

const requestMgrModel = {
  getRequestsByDepartment: (deptId) => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT r.*, u.f_name, u.l_name, u.u_mail, a.app_mgr
        FROM tbl_requests r
        LEFT JOIN tbl_users u ON r.u_id = u.u_id
        LEFT JOIN tbl_approve a ON r.approve_id = a.approve_id
        ORDER BY r.date_time DESC
      `;
      
      db.query(query, [deptId], (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results);
      });
    });
  },

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

  getRequestDetails: (requestId) => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT r.*, u.f_name, u.l_name, u.u_mail, a.app_mgr
        FROM tbl_requests r
        LEFT JOIN tbl_users u ON r.u_id = u.u_id
        LEFT JOIN tbl_approve a ON r.approve_id = a.approve_id
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

  updateRequestStatus: (req_id, is_approved) => {
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE tbl_approve
        SET app_mgr = ?
        WHERE approve_id = (
          SELECT approve_id
          FROM tbl_requests
          WHERE req_id = ?
        )
      `;
      
      const status = is_approved ? ApprovalStatus.APPROVE : ApprovalStatus.REJECT;
      
      db.query(query, [status, req_id], (error, results) => {
        if (error) {
          console.error('Error in updateRequestStatus:', error);
          return reject(error);
        }
        resolve(results.affectedRows > 0);
      });
    });
  },

  getRequestById: (requestId) => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT r.*, u.f_name, u.l_name, u.u_mail, d.dept_name
        FROM tbl_requests r
        JOIN tbl_users u ON r.u_id = u.u_id
        JOIN tbl_dept d ON u.dept_id = d.dept_id
        WHERE r.req_id = ?
      `;
      
      db.query(query, [requestId], (error, results) => {
        if (error) {
          return reject(error);
        }
        if (results.length === 0) {
          return reject(new Error('Request not found'));
        }
        resolve(results[0]);
      });
    });
  },

  saveApproval: (req_id, mgr_id, is_approved) => {
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE tbl_approve
        SET app_mgr = ?
        WHERE approve_id = (
          SELECT approve_id
          FROM tbl_requests
          WHERE req_id = ?
        )
      `;
      db.query(query, [mgr_id, req_id], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results.affectedRows > 0);
        }
      });
    });
  },
  
  updateRequestStatus: (req_id, is_approved) => {
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE tbl_approve
        SET app_mgr = ?
        WHERE approve_id = (
          SELECT approve_id
          FROM tbl_requests
          WHERE req_id = ?
        )
      `;
      
      const status = is_approved ? ApprovalStatus.APPROVE : ApprovalStatus.REJECT;
      
      db.query(query, [status, req_id], (error, results) => {
        if (error) {
          console.error('Error in updateRequestStatus:', error);
          return reject(error);
        }
        if (results.affectedRows === 0) {
          console.error('No rows updated for req_id:', req_id);
          return reject(new Error('No rows updated'));
        }
        console.log(`Successfully updated status to ${status} for req_id: ${req_id}`);
        resolve(true);
      });
    });
  },

  handleRequest: (req_id, is_approved) => {
      return new Promise(async (resolve, reject) => {
          try {
              console.log('Processing request:', { req_id, is_approved }); // เพิ่ม log
  
              // เริ่ม transaction
              await db.beginTransaction();
  
              // อัพเดทสถานะการอนุมัติ
              await requestMgrModel.updateRequestStatus(req_id, is_approved);
  
              // Commit transaction
              await db.commit();
  
              const status = is_approved ? 'อนุมัติ' : 'ปฏิเสธ';
              resolve({ success: true, message: `คำขอซ่อมได้ถูก${status}เรียบร้อยแล้ว` });
          } catch (error) {
              // Rollback ในกรณีที่เกิดข้อผิดพลาด
              await db.rollback();
              console.error('Error in handleRequest:', error);
              reject({ success: false, message: 'เกิดข้อผิดพลาดในการดำเนินการ' });
          }
      });
  }
};

module.exports = requestMgrModel;
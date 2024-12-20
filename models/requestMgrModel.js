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
        SELECT r.*, a.app_mgr, u.f_name, u.l_name, u.u_mail, d.dept_name
        FROM tbl_requests r
        LEFT JOIN tbl_users u ON r.u_id = u.u_id
        LEFT JOIN tbl_approve a ON r.approve_id = a.approve_id
        LEFT JOIN tbl_dept d ON u.dept_id = d.dept_id
        WHERE r.req_id = ?
      `;
      
      db.query(query, [requestId], (error, results) => {
        if (error) {
          console.error('Error getting request by ID:', error);
          return reject(error);
        }
        if (results.length === 0) {
          return resolve(null);
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
              UPDATE tbl_approve a
              JOIN tbl_requests r ON a.approve_id = r.approve_id
              SET a.app_mgr = ?
              WHERE r.req_id = ?
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
              console.log('Processing request:', { req_id, is_approved });
              
              await db.beginTransaction();
  
              let status;
              if (is_approved === true || is_approved === 'true' || is_approved === 1 || is_approved === '1') {
                  status = ApprovalStatus.APPROVE;
              } else if (is_approved === false || is_approved === 'false' || is_approved === 0 || is_approved === '0') {
                  status = ApprovalStatus.REJECT;
              } else {
                  throw new Error('Invalid is_approved value');
              }
              console.log('Setting status to:', status);
  
              const updateResult = await requestMgrModel.updateRequestStatus(req_id, status);
              if (!updateResult) {
                  throw new Error('Failed to update request status');
              }
  
              await db.commit();
  
              const message = status === ApprovalStatus.APPROVE ? 'คำขอซ่อมได้รับการอนุมัติเรียบร้อยแล้ว' : 'คำขอซ่อมถูกปฏิเสธเรียบร้อยแล้ว';
              resolve({ success: true, message: message });
          } catch (error) {
              await db.rollback();
              console.error('Error in handleRequest:', error);
              reject({ success: false, message: 'เกิดข้อผิดพลาดในการดำเนินการ: ' + error.message });
          }
      });
  },

  refreshRequestData: (requestId) => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT r.*, a.app_mgr
        FROM tbl_requests r
        LEFT JOIN tbl_approve a ON r.approve_id = a.approve_id
        WHERE r.req_id = ?
      `;
      
      db.query(query, [requestId], (error, results) => {
        if (error) {
          console.error('Error refreshing request data:', error);
          return reject(error);
        }
        resolve(results[0]);
      });
    });
  },

  getUserByRoleId: (roleId) => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM tbl_users WHERE role_id = ? LIMIT 1';
      db.query(query, [roleId], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results[0] || null);
        }
      });
    });
  },

  updateApprovalStatus: (req_id, status) => {
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE tbl_approve a
        JOIN tbl_requests r ON a.approve_id = r.approve_id
        SET a.app_mgr = ?
        WHERE r.req_id = ?
      `;
      db.query(query, [status, req_id], (error, results) => {
        if (error) {
          console.error('Error updating approval status:', error);
          reject({ success: false, message: 'Failed to update approval status' });
        } else {
          if (results.affectedRows > 0) {
            resolve({ success: true, message: 'Approval status updated successfully' });
          } else {
            reject({ success: false, message: 'No matching record found for update' });
          }
        }
      });
    });
  },
  
};

module.exports = requestMgrModel;
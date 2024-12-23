const db = require('../config/database');

const RequestAdminModel = {
    getApprovedRequests: () => {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT r.*, u.f_name, u.l_name, d.dept_name, a.app_mgr, a.app_hrga
                FROM tbl_requests r
                JOIN tbl_users u ON r.u_id = u.u_id
                JOIN tbl_dept d ON u.dept_id = d.dept_id
                JOIN tbl_approve a ON r.approve_id = a.approve_id
                WHERE a.app_mgr = 'approve' AND a.app_hrga = 'approve'
                ORDER BY r.date_time DESC
            `;
            
            db.query(query, (error, results) => {
                if (error) {
                    console.error('Error in getApprovedRequests:', error);
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    },

    getRequestById: (requestId) => {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT r.*, u.f_name, u.l_name, u.u_mail, d.dept_name, a.app_mgr, a.app_hrga
                FROM tbl_requests r
                JOIN tbl_users u ON r.u_id = u.u_id
                JOIN tbl_dept d ON u.dept_id = d.dept_id
                JOIN tbl_approve a ON r.approve_id = a.approve_id
                WHERE r.req_id = ?
            `;
            db.query(query, [requestId], (error, results) => {
                if (error) {
                    console.error('Error in getRequestById:', error);
                    return reject(error);
                }
                if (results.length === 0) {
                    return resolve(null);
                }
                const result = results[0];
                ['r_pic1', 'r_pic2', 'r_pic3'].forEach(pic => {
                    if (result[pic]) {
                        result[pic] = result[pic].toString('base64');
                    }
                });
                resolve(result);
            });
        });
    },

    updateRequestStatus: (requestId, status) => {
        return new Promise((resolve, reject) => {
            const query = `
                UPDATE tbl_approve
                SET app_hrga = ?
                WHERE approve_id = (SELECT approve_id FROM tbl_requests WHERE req_id = ?)
            `;
            db.query(query, [status, requestId], (error, result) => {
                if (error) {
                    console.error('Error in updateRequestStatus:', error);
                    reject(error);
                } else {
                    resolve(result.affectedRows > 0);
                }
            });
        });
    },

    getAllRequests: () => {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT r.*, u.f_name, u.l_name, d.dept_name, a.app_mgr, a.app_hrga
                FROM tbl_requests r
                JOIN tbl_users u ON r.u_id = u.u_id
                JOIN tbl_dept d ON u.dept_id = d.dept_id
                JOIN tbl_approve a ON r.approve_id = a.approve_id
                ORDER BY r.date_time DESC
            `;
            
            db.query(query, (error, results) => {
                if (error) {
                    console.error('Error in getAllRequests:', error);
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    },

    updateRequest: (req_id, survey_results, work_cause, edit_details, date_by, time_taken, edit_by, budget_by) => {
      return new Promise((resolve, reject) => {
        const updateWorkerQuery = `
          UPDATE tbl_worker
          SET survey_results = ?, work_cause = ?, edit_details = ?, date_by = ?, finish_time = ?, edit_by = ?, budget_by = ?
          WHERE worker_id = (SELECT worker_id FROM tbl_requests WHERE req_id = ?)
        `;
        
        db.query(updateWorkerQuery, [survey_results, work_cause, edit_details, date_by, time_taken, edit_by, budget_by, req_id], (error, result) => {
          if (error) {
            console.error('Error in updateRequest:', error);
            reject(error);
          } else {
            resolve(result.affectedRows > 0);
          }
        });
      });
    },

};

module.exports = RequestAdminModel;
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

    beginTransaction: () => {
        return new Promise((resolve, reject) => {
            db.beginTransaction((err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    },

    commitTransaction: () => {
        return new Promise((resolve, reject) => {
            db.commit((err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    },

    rollbackTransaction: () => {
        return new Promise((resolve, reject) => {
            db.rollback(() => {
                resolve();
            });
        });
    },

    updateRequest: (req_id, updateData) => {
        return new Promise((resolve, reject) => {
            // สร้างอาร์เรย์สำหรับเก็บคอลัมน์และค่าที่จะอัปเดต
            const columns = [];
            const values = [];
    
            // ตรวจสอบและเพิ่มข้อมูลที่จะอัปเดตเข้าไปในอาร์เรย์
            if (updateData.survey_results !== undefined) {
                columns.push('survey_results = ?');
                values.push(updateData.survey_results);
            }
            if (updateData.work_cause !== undefined) {
                columns.push('work_cause = ?');
                values.push(updateData.work_cause);
            }
            if (updateData.edit_details !== undefined) {
                columns.push('edit_details = ?');
                values.push(updateData.edit_details);
            }
            if (updateData.date_by !== undefined) {
                columns.push('date_by = ?');
                values.push(updateData.date_by);
            }
            if (updateData.time_taken !== undefined) {
                columns.push('finish_time = ?');
                values.push(updateData.time_taken);
            }
            if (updateData.edit_by !== undefined) {
                columns.push('edit_by = ?');
                values.push(updateData.edit_by);
            }
            if (updateData.budget_by !== undefined) {
                columns.push('budget_by = ?');
                values.push(updateData.budget_by);
            }
    
            // ถ้าไม่มีข้อมูลที่จะอัปเดต ให้ resolve ทันที
            if (columns.length === 0) {
                return resolve(true);
            }
    
            // สร้าง SQL query
            const updateWorkerQuery = `
                UPDATE tbl_worker
                SET ${columns.join(', ')}
                WHERE worker_id = (SELECT worker_id FROM tbl_requests WHERE req_id = ?)
            `;
    
            // เพิ่ม req_id เข้าไปใน values array
            values.push(req_id);
    
            db.query(updateWorkerQuery, values, (error, result) => {
                if (error) {
                    console.error('Error in updateRequest:', error);
                    reject(error);
                } else {
                    resolve(result.affectedRows > 0);
                }
            });
        });
    },

    updateWorkerStatus: (req_id, status) => {
        return new Promise((resolve, reject) => {
            const query = `
                UPDATE tbl_worker
                SET worker_status = ?
                WHERE worker_id = (SELECT worker_id FROM tbl_requests WHERE req_id = ?)
            `;
            db.query(query, [status, req_id], (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result.affectedRows > 0);
                }
            });
        });
    },

};

module.exports = RequestAdminModel;
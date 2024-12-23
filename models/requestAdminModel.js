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
                SELECT r.*, u.f_name, u.l_name, u.u_mail, d.dept_name, a.app_mgr, a.app_hrga, 
                       w.worker_status, w.finish_time
                FROM tbl_requests r
                JOIN tbl_users u ON r.u_id = u.u_id
                JOIN tbl_dept d ON u.dept_id = d.dept_id
                JOIN tbl_approve a ON r.approve_id = a.approve_id
                LEFT JOIN tbl_worker w ON r.worker_id = w.worker_id
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
                console.log('Request data:', result); // เพิ่มบรรทัดนี้เพื่อตรวจสอบข้อมูลที่ถูกดึงมา
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
            const workerColumns = [];
            const workerValues = [];
            const requestColumns = [];
            const requestValues = [];
    
            // ตรวจสอบและเพิ่มข้อมูลที่จะอัปเดตเข้าไปในอาร์เรย์
            if (updateData.survey_results !== undefined) {
                workerColumns.push('survey_results = ?');
                workerValues.push(updateData.survey_results);
            }
            if (updateData.work_cause !== undefined) {
                workerColumns.push('work_cause = ?');
                workerValues.push(updateData.work_cause);
            }
            if (updateData.edit_details !== undefined) {
                workerColumns.push('edit_details = ?');
                workerValues.push(updateData.edit_details);
            }
            if (updateData.date_by !== undefined) {
                workerColumns.push('date_by = ?');
                workerValues.push(updateData.date_by);
            }
            if (updateData.finish_time !== undefined) {
                if (updateData.finish_time === null || updateData.finish_time === '') {
                    workerColumns.push('finish_time = NULL');
                } else {
                    // แปลงเวลาเป็นนาที
                    const finishTimeInMinutes = parseInt(updateData.finish_time);
                    if (!isNaN(finishTimeInMinutes)) {
                        workerColumns.push('finish_time = ?');
                        workerValues.push(finishTimeInMinutes);
                    } else {
                        console.error('Invalid finish_time format:', updateData.finish_time);
                        // อาจจะเพิ่มการจัดการข้อผิดพลาดเพิ่มเติมตามต้องการ
                    }
                }
            }
            if (updateData.edit_by !== undefined) {
                workerColumns.push('edit_by = ?');
                workerValues.push(updateData.edit_by);
            }
            if (updateData.budget_by !== undefined) {
                workerColumns.push('budget_by = ?');
                workerValues.push(updateData.budget_by);
            }
    
            // เพิ่มการอัปเดตสถานะใน tbl_requests
            if (updateData.status !== undefined) {
                requestColumns.push('status = ?');
                requestValues.push(updateData.status);
            }
    
            // ถ้าไม่มีข้อมูลที่จะอัปเดต ให้ resolve ทันที
            if (workerColumns.length === 0 && requestColumns.length === 0) {
                return resolve(true);
            }
    
            // เริ่ม transaction
            db.beginTransaction(async (err) => {
                if (err) {
                    return reject(err);
                }
    
                try {
                    // อัปเดต tbl_worker
                    if (workerColumns.length > 0) {
                        const updateWorkerQuery = `
                            UPDATE tbl_worker
                            SET ${workerColumns.join(', ')}
                            WHERE worker_id = (SELECT worker_id FROM tbl_requests WHERE req_id = ?)
                        `;
                        await new Promise((resolve, reject) => {
                            db.query(updateWorkerQuery, [...workerValues, req_id], (error, result) => {
                                if (error) reject(error);
                                else resolve(result);
                            });
                        });
                    }
    
                    // อัปเดต tbl_requests
                    if (requestColumns.length > 0) {
                        const updateRequestQuery = `
                            UPDATE tbl_requests
                            SET ${requestColumns.join(', ')}
                            WHERE req_id = ?
                        `;
                        await new Promise((resolve, reject) => {
                            db.query(updateRequestQuery, [...requestValues, req_id], (error, result) => {
                                if (error) reject(error);
                                else resolve(result);
                            });
                        });
                    }
    
                    // Commit transaction
                    db.commit((err) => {
                        if (err) {
                            return db.rollback(() => {
                                reject(err);
                            });
                        }
                        resolve(true);
                    });
                } catch (error) {
                    db.rollback(() => {
                        reject(error);
                    });
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

    getWorkerInfoByRequestId: (requestId) => {
      return new Promise((resolve, reject) => {
        const query = `
          SELECT w.* 
          FROM tbl_worker w
          JOIN tbl_requests r ON w.worker_id = r.worker_id
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

};

module.exports = RequestAdminModel;
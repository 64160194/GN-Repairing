const db = require('../config/database');

const manageDeptModel = {
    getAllDepartments: () => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM tbl_dept WHERE dept_status = 1 ORDER BY dept_name ASC';
            db.query(query, (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    },

    addDepartment: (dept_name) => {
      return new Promise((resolve, reject) => {
        // ขั้นตอนที่ 1: หา ID สูงสุดที่มีอยู่
        db.query('SELECT MAX(dept_id) as maxId FROM tbl_dept', (error, results) => {
          if (error) {
            reject(error);
            return;
          }
          
          const newId = (results[0].maxId || 0) + 1;
          
          // ขั้นตอนที่ 2: เพิ่มแผนกใหม่ด้วย ID ที่คำนวณได้
          const query = 'INSERT INTO tbl_dept (dept_id, dept_name, dept_status) VALUES (?, ?, 1)';
          db.query(query, [newId, dept_name], (error, results) => {
            if (error) {
              reject(error);
            } else {
              resolve(newId);
            }
          });
        });
      });
    },

    deleteDepartment: (id) => {
        return new Promise((resolve, reject) => {
            const query = 'UPDATE tbl_dept SET dept_status = 0 WHERE dept_id = ?';
            db.query(query, [id], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    },

    updateDepartment: (id, name) => {
        return new Promise((resolve, reject) => {
            const query = 'UPDATE tbl_dept SET dept_name = ? WHERE dept_id = ?';
            db.query(query, [name, id], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results.affectedRows > 0);
                }
            });
        });
    },

    getDepartmentById: (id) => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM tbl_dept WHERE dept_id = ?';
            db.query(query, [id], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results[0]);
                }
            });
        });
    }
};

module.exports = manageDeptModel;
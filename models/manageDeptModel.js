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
        db.query('SELECT MAX(dept_id) as maxId FROM tbl_dept', (error, results) => {
          if (error) {
            reject(error);
            return;
          }
          
          const newId = (results[0].maxId || 0) + 1;
          
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

    checkDepartmentUsers: (deptId) => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT COUNT(*) as count FROM tbl_users WHERE dept_id = ?';
            db.query(query, [deptId], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results[0].count > 0);
                }
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
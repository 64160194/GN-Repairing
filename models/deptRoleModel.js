const db = require('../config/database');

const deptRoleModel = {
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

  getAllRoles: () => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM tbl_role';
      db.query(query, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  }
};

module.exports = deptRoleModel;
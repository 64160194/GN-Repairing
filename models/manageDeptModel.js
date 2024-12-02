const db = require('../config/database');

const departmentModel = {
  getAllDepartments: () => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM tbl_dept ORDER BY dept_id ASC';
      db.query(query, (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results);
      });
    });
  }
};

module.exports = departmentModel;
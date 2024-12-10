const db = require('../config/database');

const maintenanceWorkerModel = {
  getAllWorkers: () => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM tbl_worker';
      db.query(query, (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results);
      });
    });
  },

  addWorker: (workerData) => {
    return new Promise((resolve, reject) => {
      const query = 'INSERT INTO tbl_worker SET ?';
      db.query(query, workerData, (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results.insertId);
      });
    });
  },

  updateWorker: (workerId, workerData) => {
    return new Promise((resolve, reject) => {
      const query = 'UPDATE tbl_worker SET ? WHERE worker_id = ?';
      db.query(query, [workerData, workerId], (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results.affectedRows > 0);
      });
    });
  },

  deleteWorker: (workerId) => {
    return new Promise((resolve, reject) => {
      const query = 'DELETE FROM tbl_worker WHERE worker_id = ?';
      db.query(query, [workerId], (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results.affectedRows > 0);
      });
    });
  }
};

module.exports = maintenanceWorkerModel;
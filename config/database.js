const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'general_repairing'
});

db.connect((error) => {
  if (error) {
    console.error('Error connecting to database:', error);
  } else {
    console.log('Successfully connected to the database');
  }
});

// Wrapper function to promisify db.query
db.queryAsync = (sql, values) => {
  return new Promise((resolve, reject) => {
    db.query(sql, values, (error, results) => {
      if (error) {
        return reject(error);
      }
      resolve(results);
    });
  });
};

module.exports = db;
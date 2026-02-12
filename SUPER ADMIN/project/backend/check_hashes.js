const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'attendance_system'
});

db.connect(err => {
  if (err) {
    console.error('DB connection error:', err);
    process.exit(1);
  }
  console.log('Connected to MySQL!');
  checkUsers();
});

function checkUsers() {
  const tables = ['admins', 'data_entries', 'billing_records', 'officers', 'students'];
  
  let completed = 0;
  tables.forEach(table => {
    db.query(`SELECT * FROM ${table}`, (err, results) => {
      if (err) console.error(`Error querying ${table}:`, err);
      else {
        console.log(`\n--- ${table} ---`);
        results.forEach(row => {
          console.log(`User: ${row.username || row.enrollment_no}, Hash: ${row.password_hash} (${typeof row.password_hash})`);
        });
      }
      
      completed++;
      if (completed === tables.length) {
        db.end();
      }
    });
  });
}

const mysql = require('mysql2');
const bcrypt = require('bcrypt');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'attendance_system'
});

db.connect(async err => {
  if (err) {
    console.error('DB connection error:', err);
    process.exit(1);
  }
  console.log('Connected to MySQL!');
  
  try {
    const password = '12345';
    const hash = await bcrypt.hash(password, 10);
    console.log(`Generated hash for '${password}': ${hash}`);

    // Update students with NULL password_hash
    const updateQuery = `UPDATE students SET password_hash = ? WHERE password_hash IS NULL OR password_hash = '12345'`;
    
    db.query(updateQuery, [hash], (err, result) => {
      if (err) {
        console.error('Error updating students:', err);
      } else {
        console.log(`Updated ${result.affectedRows} student records with valid hash.`);
      }
      db.end();
    });

  } catch (error) {
    console.error('Error:', error);
    db.end();
  }
});

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '', // Trying empty password
  multipleStatements: true
};

async function setupDatabase() {
  let connection;
  try {
    console.log('Connecting to MySQL...');
    connection = await mysql.createConnection(dbConfig);
    console.log('Connected!');

    console.log('Reading final_db.sql...');
    const initSqlPath = path.join(__dirname, 'final_db.sql');
    const initSql = fs.readFileSync(initSqlPath, 'utf8');

    console.log('Executing final_db.sql...');
    await connection.query(initSql);
    console.log('Database initialized.');

    // Connect to the newly created database
    await connection.changeUser({ database: 'attendance_system' });

    console.log('Checking for existing admins...');
    const [rows] = await connection.query('SELECT * FROM admins WHERE username = ?', ['admin']);
    
    if (rows.length === 0) {
      console.log('Creating default super admin...');
      const password = 'admin123';
      const hash = await bcrypt.hash(password, 10);
      
      await connection.query(
        'INSERT INTO admins (username, password_hash, full_name) VALUES (?, ?, ?)',
        ['admin', hash, 'Super Admin']
      );
      console.log('Super Admin created: admin / admin123');
    } else {
      console.log('Super Admin already exists.');
    }

  } catch (error) {
    console.error('Error during setup:', error);
  } finally {
    if (connection) await connection.end();
  }
}

setupDatabase();

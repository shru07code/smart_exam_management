const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // Correct password from server.js
  database: 'attendance_system',
  multipleStatements: true
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    process.exit(1);
  }
  console.log('Connected to MySQL!');

  const sql = `
    -- 1. Paper Inventory: Add qp_code
    ALTER TABLE paper_inventory ADD COLUMN IF NOT EXISTS qp_code VARCHAR(50) AFTER subject_code;

    -- 2. Extra Paper: Add columns
    ALTER TABLE extra_paper ADD COLUMN IF NOT EXISTS id INT AUTO_INCREMENT PRIMARY KEY FIRST;
    ALTER TABLE extra_paper ADD COLUMN IF NOT EXISTS date DATE;
    ALTER TABLE extra_paper ADD COLUMN IF NOT EXISTS session VARCHAR(20);
    ALTER TABLE extra_paper ADD COLUMN IF NOT EXISTS extra INT DEFAULT 0;
    ALTER TABLE extra_paper ADD COLUMN IF NOT EXISTS less INT DEFAULT 0;
    ALTER TABLE extra_paper ADD COLUMN IF NOT EXISTS reason VARCHAR(255);

    -- 3. Subject Sections: Add columns
    ALTER TABLE subject_sections ADD COLUMN IF NOT EXISTS id INT AUTO_INCREMENT PRIMARY KEY FIRST;
    ALTER TABLE subject_sections ADD COLUMN IF NOT EXISTS section VARCHAR(20);
    ALTER TABLE subject_sections ADD COLUMN IF NOT EXISTS subject_name VARCHAR(100);

    -- 4. Detained Students: Add columns
    ALTER TABLE detained_students ADD COLUMN IF NOT EXISTS subject_code VARCHAR(20);
    ALTER TABLE detained_students ADD COLUMN IF NOT EXISTS reason VARCHAR(255);
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error updating schema:', err);
    } else {
      console.log('Schema updated successfully!');
    }
    db.end();
  });
});

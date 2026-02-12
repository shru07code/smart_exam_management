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
  seedData();
});

function seedData() {
  const date = '2026-01-25';
  const session = 'Morning Session';
  const morningShort = 'Morning';

  const queries = [
    // 1. Exam Timetable
    `INSERT IGNORE INTO exam_timetable (exam_date, session, session_type, subject_code, subject_name, scheme) VALUES 
     ('${date}', '${morningShort}', '${session}', '22416', 'Database Management', 'I-Scheme')`,

    // 2. Block Allocation
    `INSERT INTO block_allocation (exam_date, session, block_id, institute_code, course, subject_code, subject_name, start_seat_no, end_seat_no, total_students) VALUES 
     ('${date}', '${morningShort}', 1, '1644', 'CO', '22416', 'Database Management', 2001, 2020, 20)`,
     
    // 3. Supervisor Allocation
    `INSERT INTO supervisor_allocation (exam_date, session, block_id, supervisor_id) VALUES 
     ('${date}', '${session}', 1, 1)`,
     
    // 4. Paper Inventory
    `INSERT IGNORE INTO paper_inventory (subject_code, subject_name, quantity) VALUES 
     ('22416', 'Database Management', 25)`,

    // 5. Seating Chart (Assign existing students to this new exam)
    `INSERT IGNORE INTO seating_chart (seat_no, subject_code, institute_code, course) VALUES 
     (2001, '22416', '1644', 'CO'), (2002, '22416', '1644', 'CO'), (2003, '22416', '1644', 'CO')`,

    // 6. Marksheet Data (For reports)
    `INSERT IGNORE INTO marksheet (marksheet_no, subject_abb, course, subject_code, institute_code) VALUES 
     ('12347', 'DMS', 'CO', '22416', '1644')`
  ];

  let completed = 0;
  queries.forEach((q, idx) => {
    db.query(q, (err, res) => {
      if (err) console.error(`Query ${idx} failed:`, err.message);
      else console.log(`Query ${idx} executed.`);
      
      completed++;
      if (completed === queries.length) {
        console.log('Seeding for 2026-01-25 complete.');
        db.end();
        process.exit(0);
      }
    });
  });
}

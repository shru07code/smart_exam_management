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
  const date = '2026-01-20';
  const session = 'Morning Session';
  const morningShort = 'Morning';

  const queries = [
    // 1. Blocks
    `INSERT IGNORE INTO blocks1 (id, name, location, col1, col2) VALUES 
     (1, 'Block-01', 'Room-101', 10, 10),
     (2, 'Block-02', 'Room-102', 10, 10)`,

    // 2. Exam Timetable
    `INSERT IGNORE INTO exam_timetable (exam_date, session, session_type, subject_code, subject_name, scheme) VALUES 
     ('${date}', '${morningShort}', '${session}', '22412', 'Java Programming', 'I-Scheme'),
     ('${date}', '${morningShort}', '${session}', '22413', 'Software Engineering', 'I-Scheme')`,

    // 3. Block Allocation
    `INSERT INTO block_allocation (exam_date, session, block_id, institute_code, course, subject_code, subject_name, start_seat_no, end_seat_no, total_students) VALUES 
     ('${date}', '${morningShort}', 1, '1644', 'CO', '22412', 'Java Programming', 2001, 2020, 20),
     ('${date}', '${morningShort}', 2, '1644', 'IF', '22413', 'Software Engineering', 3001, 3020, 20)`,
     
    // 4. Supervisors
    `INSERT IGNORE INTO supervisors (name, designation) VALUES 
     ('Mr. A. B. Patil', 'Lecturer'),
     ('Mrs. S. K. Deshmukh', 'Lecturer')`,
     
    // 5. Supervisor Allocation
    `INSERT INTO supervisor_allocation (exam_date, session, block_id, supervisor_id) VALUES 
     ('${date}', '${session}', 1, 1),
     ('${date}', '${session}', 2, 2)`,
     
    // 6. Paper Inventory (for receipts)
    `INSERT IGNORE INTO paper_inventory (subject_code, subject_name, quantity) VALUES 
     ('22412', 'Java Programming', 25),
     ('22413', 'Software Engineering', 25)`,

    // 7. Seating Chart (CRITICAL FOR SPECIAL CODES)
    `INSERT IGNORE INTO seating_chart (seat_no, subject_code, institute_code, course) VALUES 
     (2001, '22412', '1644', 'CO'), (2002, '22412', '1644', 'CO'), (2003, '22412', '1644', 'CO'),
     (3001, '22413', '1644', 'IF'), (3002, '22413', '1644', 'IF'), (3003, '22413', '1644', 'IF')`,

    // 8. Students (To show names)
    `INSERT IGNORE INTO students (full_name, enrollment_no, seat_no, scheme) VALUES 
     ('Amit Sharma', '20012001', 2001, 'I-Scheme'),
     ('Priya Singh', '20012002', 2002, 'I-Scheme'),
     ('Rahul Verma', '20012003', 2003, 'I-Scheme'),
     ('Sneha Patil', '30013001', 3001, 'I-Scheme'),
     ('Vikas Rao', '30013002', 3002, 'I-Scheme'),
     ('Neha Gupta', '30013003', 3003, 'I-Scheme')`,

    // 9. Marksheet Data (Required for Format-07)
    `INSERT IGNORE INTO marksheet (marksheet_no, subject_abb, course, subject_code, institute_code) VALUES 
     ('12345', 'JPR', 'CO', '22412', '1644'),
     ('12346', 'SEN', 'IF', '22413', '1644')`
  ];

  let completed = 0;
  queries.forEach((q, idx) => {
    db.query(q, (err, res) => {
      if (err) console.error(`Query ${idx} failed:`, err.message);
      else console.log(`Query ${idx} executed.`);
      
      completed++;
      if (completed === queries.length) {
        console.log('Seeding complete.');
        db.end();
        process.exit(0);
      }
    });
  });
}

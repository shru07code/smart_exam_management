const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', 
  database: 'attendance_system',
  multipleStatements: true
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to database.');
  seedSpecificDate();
});

async function seedSpecificDate() {
  const date = '2026-01-20';
  
  const queries = [
    // 1. Add Paper Inventory for new subjects
    `INSERT IGNORE INTO paper_inventory (subject_code, subject_name, quantity) VALUES 
     ('22617', 'Mobile Application Development', 150),
     ('22618', 'Emerging Trends in Computer Engineering', 150);`,

    // 2. Exam Timetable
    `INSERT IGNORE INTO exam_timetable (session_type, exam_date, day, session, time_slot, subject_code, subject_name, scheme) VALUES 
     ('Morning Session', '${date}', 'Tuesday', 'Morning', '09:30 AM - 12:30 PM', '22617', 'Mobile Application Development', 'I-Scheme'),
     ('Afternoon Session', '${date}', 'Tuesday', 'Afternoon', '02:00 PM - 05:00 PM', '22618', 'Emerging Trends in Computer Engineering', 'I-Scheme');`,

    // 3. Block Allocation (Using existing Block IDs 1 and 2)
    `INSERT INTO block_allocation (exam_date, session, block_id, institute_code, course, subject_name, subject_code, start_seat_no, end_seat_no, total_students) VALUES 
     ('${date}', 'Morning', 1, '0001', 'CO', 'Mobile Application Development', '22617', '1001', '1020', 20),
     ('${date}', 'Morning', 2, '0001', 'CO', 'Mobile Application Development', '22617', '1021', '1040', 20),
     ('${date}', 'Afternoon', 1, '0001', 'CO', 'Emerging Trends', '22618', '1001', '1020', 20);`,

    // 4. Supervisor Allocation (Using existing Supervisor IDs 1 and 2)
    `INSERT INTO supervisor_allocation (exam_date, session, block_id, supervisor_id, reliever_id) VALUES 
     ('${date}', 'Morning', 1, 1, 3),
     ('${date}', 'Morning', 2, 2, 3),
     ('${date}', 'Afternoon', 1, 4, 5);`,

    // 5. Bundle Receipts
    `INSERT INTO bundle_receipts (receipt_type, exam_date, session, institute_code, subject_code, bundle_no, packets_received, received_by, status) VALUES 
     ('Regular', '${date}', 'Morning', '0001', '22617', 'BUN-2026-001', 2, 'Officer1', 'Received'),
     ('Regular', '${date}', 'Afternoon', '0001', '22618', 'BUN-2026-002', 2, 'Officer1', 'Received');`
  ];

  try {
    for (const sql of queries) {
      await new Promise((resolve, reject) => {
        db.query(sql, (err, result) => {
          if (err) {
            console.error('Query failed:', err.message);
            // Continue despite errors (e.g., duplicates)
          }
          resolve();
        });
      });
    }
    console.log(`--- Demo Data for ${date} Added Successfully ---`);
  } catch (err) {
    console.error('Seeding error:', err);
  } finally {
    db.end();
  }
}

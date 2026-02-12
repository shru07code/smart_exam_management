const mysql = require('mysql');
const bcrypt = require('bcryptjs');

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
  seedRemainingTables();
});

async function seedRemainingTables() {
  const date = '2026-01-20';
  const passwordHash = await bcrypt.hash('password', 10);

  const queries = [
    // 1. ABSENT RECORDS
    `INSERT IGNORE INTO absent_records (exam_date, session, subject_code, seat_no, block_id, marked_by) VALUES 
     ('${date}', 'Morning', '22617', '1005', 1, 'Prof. Amit Singh'),
     ('${date}', 'Morning', '22617', '1012', 1, 'Prof. Amit Singh'),
     ('${date}', 'Afternoon', '22618', '1003', 1, 'Prof. Neha Gupta');`,

    // 2. ANSWER BOOK BUNDLES (Submitted to DC)
    `INSERT IGNORE INTO answer_book_bundles (exam_date, session, bundle_number, course_name, subject_code, answer_book_count, marksheet_no, submitted_by, status) VALUES 
     ('${date}', 'Morning', 'BUN-001', 'CO', '22617', 20, 'MK-22617-A', 'Officer1', 'Submitted'),
     ('${date}', 'Morning', 'BUN-002', 'CO', '22617', 18, 'MK-22617-B', 'Officer1', 'Submitted'),
     ('${date}', 'Afternoon', 'BUN-003', 'CO', '22618', 20, 'MK-22618-A', 'Officer1', 'Submitted');`,

    // 3. BILLING RECORDS (Staff/Supervisors)
    `INSERT IGNORE INTO billing_records (date, username, password_hash) VALUES 
     ('${date}', 'BillingClerk1', '${passwordHash}'),
     ('${date}', 'BillingClerk2', '${passwordHash}');`,

    // 4. DETAINED STUDENTS
    `INSERT IGNORE INTO detained_students (seat_no) VALUES 
     ('1009'),
     ('1015'),
     ('1018');`,

    // 5. EXTRA PAPER RECORDS
    `INSERT IGNORE INTO extra_paper (subject_code, quantity) VALUES 
     ('22617', '5'),
     ('22618', '3');`,

    // 6. QP USAGE LOG
    `INSERT IGNORE INTO qp_usage_log (exam_date, session, subject_code, total_received, used_count, scrapped_count, balance_count, remark, submitted_by) VALUES 
     ('${date}', 'Morning', '22617', 50, 38, 2, 10, 'All OK', 'Officer1'),
     ('${date}', 'Afternoon', '22618', 50, 40, 0, 10, 'All OK', 'Officer1');`,

    // 7. RAC QUESTION PAPERS
    `INSERT IGNORE INTO rac_qpapers (count) VALUES 
     (100), (200), (150);`,

    // 8. SPECIAL CODE ASSIGNMENTS (Malpractice/Medical)
    `INSERT IGNORE INTO special_code_assignments (exam_date, session, seat_no, subject_code, special_code, reason) VALUES 
     ('${date}', 'Morning', '1005', '22617', 'MED', 'Medical Leave'),
     ('${date}', 'Morning', '1019', '22617', 'MP', 'Malpractice Case');`
  ];

  try {
    for (const sql of queries) {
      await new Promise((resolve, reject) => {
        db.query(sql, (err, result) => {
          if (err) {
            console.error('Query failed:', err.message);
            // Continue despite errors
          }
          resolve();
        });
      });
    }
    console.log('--- Full Database Coverage Seeding Completed ---');
  } catch (err) {
    console.error('Seeding error:', err);
  } finally {
    db.end();
  }
}

const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
require('dotenv').config();

async function main() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'attendance_system',
    port: Number(process.env.DB_PORT || 3306),
    multipleStatements: true
  });

  const passwordHash = await bcrypt.hash('password', 10);

  const settings = [
    ['exam_center', 'Government Polytechnic, Arvi'],
    ['center_code', '1636'],
    ['district', 'Wardha'],
    ['exam_session', 'WINTER 2026']
  ];

  const timetableRows = [
    ['Morning Session', '2026-01-20', 'Tuesday', 'Morning', '09:30 AM - 12:30 PM', '22617', 'Mobile Application Development', 'I-Scheme'],
    ['Afternoon Session', '2026-01-20', 'Tuesday', 'Afternoon', '02:00 PM - 05:00 PM', '22618', 'Emerging Trends in Computer Engineering', 'I-Scheme'],
    ['Morning Session', '2026-01-21', 'Wednesday', 'Morning', '09:30 AM - 12:30 PM', '22619', 'Database Management Systems', 'I-Scheme'],
    ['Afternoon Session', '2026-01-21', 'Wednesday', 'Afternoon', '02:00 PM - 05:00 PM', '22620', 'Software Engineering', 'I-Scheme']
  ];

  const seatingRows = [];
  const studentRows = [];
  const specialAssignments = [];

  const batches = [
    { subject_code: '22617', course: 'CO', institute_code: '1601', seats: [1001, 1010] },
    { subject_code: '22618', course: 'CO', institute_code: '1601', seats: [1011, 1020] },
    { subject_code: '22619', course: 'CO', institute_code: '1602', seats: [1021, 1030] },
    { subject_code: '22620', course: 'CO', institute_code: '1602', seats: [1031, 1040] }
  ];

  let srNo = 1;
  let enrollmentSeq = 500001;
  batches.forEach((b) => {
    for (let seat = b.seats[0]; seat <= b.seats[1]; seat += 1) {
      seatingRows.push([srNo, String(seat), b.course, b.subject_code, b.institute_code]);
      studentRows.push([`Student ${seat}`, `ENR${enrollmentSeq++}`, passwordHash, String(seat), 'I-Scheme']);
      srNo += 1;
    }
  });

  specialAssignments.push(['2026-01-20', 'Morning Session', '1003', '22617', '401', 'Absent']);
  specialAssignments.push(['2026-01-20', 'Morning Session', '1007', '22617', '403', 'Copy Case']);
  specialAssignments.push(['2026-01-20', 'Afternoon Session', '1014', '22618', '408', 'Other Case']);
  specialAssignments.push(['2026-01-21', 'Morning Session', '1025', '22619', '401', 'Absent']);

  const truncateSql = `
    SET FOREIGN_KEY_CHECKS=0;
    TRUNCATE TABLE special_code_assignments;
    TRUNCATE TABLE students;
    TRUNCATE TABLE seating_chart;
    TRUNCATE TABLE exam_timetable;
    SET FOREIGN_KEY_CHECKS=1;
  `;

  try {
    await connection.query(truncateSql);
    await connection.query(
      'INSERT INTO system_settings (setting_key, setting_value) VALUES ? ON DUPLICATE KEY UPDATE setting_value=VALUES(setting_value)',
      [settings]
    );

    await connection.query(
      'INSERT INTO exam_timetable (session_type, exam_date, day, session, time_slot, subject_code, subject_name, scheme) VALUES ?',
      [timetableRows]
    );

    await connection.query(
      'INSERT INTO seating_chart (sr_no, seat_no, course, subject_code, institute_code) VALUES ?',
      [seatingRows]
    );

    await connection.query(
      'INSERT INTO students (full_name, enrollment_no, password_hash, seat_no, scheme) VALUES ?',
      [studentRows]
    );

    await connection.query(
      'INSERT INTO special_code_assignments (exam_date, session, seat_no, subject_code, special_code, reason) VALUES ?',
      [specialAssignments]
    );

    console.log('Seed completed');
    console.log(`Inserted exam_timetable: ${timetableRows.length}`);
    console.log(`Inserted seating_chart: ${seatingRows.length}`);
    console.log(`Inserted students: ${studentRows.length}`);
    console.log(`Inserted special_code_assignments: ${specialAssignments.length}`);
  } finally {
    await connection.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});


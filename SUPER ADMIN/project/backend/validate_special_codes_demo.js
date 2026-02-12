const mysql = require('mysql2/promise');
require('dotenv').config();

function fail(message, details) {
  const payload = { ok: false, message };
  if (details) payload.details = details;
  console.error(JSON.stringify(payload, null, 2));
  process.exit(1);
}

async function main() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'attendance_system',
    port: Number(process.env.DB_PORT || 3306)
  });

  try {
    const [[timetableCount]] = await connection.query('SELECT COUNT(*) AS c FROM exam_timetable');
    const [[seatingCount]] = await connection.query('SELECT COUNT(*) AS c FROM seating_chart');
    const [[studentsCount]] = await connection.query('SELECT COUNT(*) AS c FROM students');
    const [[assignCount]] = await connection.query('SELECT COUNT(*) AS c FROM special_code_assignments');

    if (timetableCount.c === 0) fail('exam_timetable is empty');
    if (seatingCount.c === 0) fail('seating_chart is empty');
    if (studentsCount.c === 0) fail('students is empty');

    const [missingSeating] = await connection.query(`
      SELECT 
        et.exam_date, et.session_type, et.subject_code,
        COUNT(sc.seat_no) AS seat_count
      FROM exam_timetable et
      LEFT JOIN seating_chart sc ON sc.subject_code = et.subject_code
      GROUP BY et.exam_date, et.session_type, et.subject_code
      HAVING seat_count = 0
    `);
    if (missingSeating.length > 0) fail('Some timetable subjects have no seating rows', missingSeating);

    const [[coverage]] = await connection.query(`
      SELECT
        COUNT(*) AS seat_total,
        SUM(CASE WHEN st.id IS NULL THEN 0 ELSE 1 END) AS seats_with_students
      FROM seating_chart sc
      LEFT JOIN students st ON st.seat_no = sc.seat_no
    `);
    if (coverage.seats_with_students < Math.min(coverage.seat_total, 10)) {
      fail('Too few seating seats have matching student records', coverage);
    }

    const [badAssignments] = await connection.query(`
      SELECT sca.exam_date, sca.session, sca.seat_no, sca.subject_code, sca.special_code
      FROM special_code_assignments sca
      LEFT JOIN seating_chart sc ON sc.seat_no = sca.seat_no AND sc.subject_code = sca.subject_code
      WHERE sc.seat_no IS NULL
      LIMIT 50
    `);
    if (badAssignments.length > 0) fail('Some special_code_assignments do not match seating_chart', badAssignments);

    const [requiredMissing] = await connection.query(`
      SELECT
        SUM(CASE WHEN exam_date IS NULL THEN 1 ELSE 0 END) AS null_exam_date,
        SUM(CASE WHEN subject_code IS NULL OR subject_code = '' THEN 1 ELSE 0 END) AS empty_subject_code,
        SUM(CASE WHEN subject_name IS NULL OR subject_name = '' THEN 1 ELSE 0 END) AS empty_subject_name,
        SUM(CASE WHEN session_type IS NULL OR session_type = '' THEN 1 ELSE 0 END) AS empty_session_type
      FROM exam_timetable
    `);
    if (requiredMissing[0].null_exam_date > 0 || requiredMissing[0].empty_subject_code > 0 || requiredMissing[0].empty_subject_name > 0) {
      fail('exam_timetable has missing required fields', requiredMissing[0]);
    }

    console.log(JSON.stringify({
      ok: true,
      counts: {
        exam_timetable: timetableCount.c,
        seating_chart: seatingCount.c,
        students: studentsCount.c,
        special_code_assignments: assignCount.c
      }
    }, null, 2));
  } finally {
    await connection.end();
  }
}

main().catch((err) => fail('Validation error', { message: err.message }));


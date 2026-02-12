const mysql = require('mysql2/promise');
require('dotenv').config();

async function hasIndex(connection, tableName, indexName) {
  const [rows] = await connection.query(
    `SELECT 1
     FROM information_schema.statistics
     WHERE table_schema = DATABASE()
       AND table_name = ?
       AND index_name = ?
     LIMIT 1`,
    [tableName, indexName]
  );
  return rows.length > 0;
}

async function ensureIndex(connection, sql, tableName, indexName) {
  const exists = await hasIndex(connection, tableName, indexName);
  if (exists) return { indexName, created: false };
  await connection.query(sql);
  return { indexName, created: true };
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
    const results = [];

    results.push(
      await ensureIndex(
        connection,
        'ALTER TABLE special_code_assignments ADD UNIQUE KEY uq_sca_exam_session_seat_subject (exam_date, session, seat_no, subject_code)',
        'special_code_assignments',
        'uq_sca_exam_session_seat_subject'
      )
    );

    results.push(
      await ensureIndex(
        connection,
        'CREATE INDEX ix_sc_subject_code ON seating_chart (subject_code)',
        'seating_chart',
        'ix_sc_subject_code'
      )
    );

    results.push(
      await ensureIndex(
        connection,
        'CREATE INDEX ix_et_date_session_subject ON exam_timetable (exam_date, session_type, subject_code)',
        'exam_timetable',
        'ix_et_date_session_subject'
      )
    );

    console.log(JSON.stringify({ ok: true, results }, null, 2));
  } finally {
    await connection.end();
  }
}

main().catch((err) => {
  console.error(JSON.stringify({ ok: false, message: err.message }, null, 2));
  process.exit(1);
});


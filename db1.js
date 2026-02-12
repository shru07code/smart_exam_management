const mysql = require("mysql2");

// 🔹 MySQL Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "KARTmysql@18",       // XAMPP default
  database: "attendance_system"
});

// 🔹 Connect
db.connect((err) => {
  if (err) {
    console.error("❌ DB Connection Failed:", err);
    return;
  }
  console.log("✅ MySQL Connected");
});

module.exports = db;

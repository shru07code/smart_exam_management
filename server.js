const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const db = require("./db1"); // 🔥 Using your db.js

const app = express();

// Allow connections from anywhere (Frontend)
app.use(cors({ origin: "*", credentials: true })); 
app.use(express.json());

/* =========================
   LOGIN API
========================= */
app.post("/api/login", (req, res) => {
  const { role, username, password } = req.body;

  // Validate basic input
  if (!role || !username) {
    return res.status(400).json({ success: false, message: "Username/Seat No required" });
  }

  /* ---------- SUPERADMIN (hashed) ---------- */
  if (role === "superadmin") {
    if (!password) return res.status(400).json({ message: "Password required" });

    const sql = "SELECT * FROM admins WHERE username=?";
    db.query(sql, [username], (err, result) => {
      if (err) return res.status(500).json({ success: false, message: "Server error" });
      if (result.length === 0) 
        return res.status(401).json({ success: false, message: "Invalid credentials" });

      bcrypt.compare(password, result[0].password_hash, (err, match) => {
        if (err) return res.status(500).json({ success: false, message: "Server error" });
        if (!match) return res.status(401).json({ success: false, message: "Invalid credentials" });

        return res.json({ success: true, role });
      });
    });
  } 
  /* ---------- STUDENT (Login by Seat Number) ---------- */
  /* ---------- STUDENT LOGIN (Updated for 'students' table) ---------- */
  else if (role === "student") {
    
    // 1. Check if both username and password are provided
    if (!username || !password) {
        return res.status(400).json({ success: false, message: "Enrollment No and Password required" });
    }

    // 2. Query the 'students' table instead of 'seating_chart'
    // We check against 'enrollment_no' because your login box says "Username / Enrollment No"
    const sql = "SELECT * FROM students WHERE enrollment_no = ? AND password = ?";
    
    db.query(sql, [username, password], (err, result) => {
      if (err) return res.status(500).json({ success: false, message: "Server error" });
      
      if (result.length === 0) {
        return res.status(401).json({ success: false, message: "Invalid Enrollment No or Password" });
      }

      // 3. Login Successful
      return res.json({ 
        success: true, 
        role: "student", 
        student_name: result[0].full_name,  // Matches your DB column 'full_name'
        seat_no: result[0].seat_no          // Matches your DB column 'seat_no'
      });
    });
  }
  /* ---------- OTHER ROLES (plain password) ---------- */
  else {
    if (!password) return res.status(400).json({ message: "Password required" });

    let table = "";
    if (role === "dataentry") table = "data_entries"; // OR 'users' if you have a specific table
    else if (role === "billing") table = "billing_records"; // Adjust table name if needed
    else if (role === "officer") table = "officers";
    else return res.status(400).json({ success: false, message: "Invalid role" });

    const sql = `SELECT * FROM ${table} WHERE username=? AND password=?`;
    db.query(sql, [username, password], (err, result) => {
      if (err) return res.status(500).json({ success: false, message: "Server error" });
      if (result.length === 0) 
        return res.status(401).json({ success: false, message: "Invalid credentials" });

      return res.json({ success: true, role });
    });
  }
});

/* =========================
   STUDENT MODULE APIS
========================= */

// 1. Get Student Seating Details (By Seat No)
app.get("/api/student/my-seating/:seat_no", (req, res) => {
  const { seat_no } = req.params;
  const sql = "SELECT * FROM seating_chart WHERE seat_no = ?";
  
  db.query(sql, [seat_no], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.length === 0) return res.status(404).json({ message: "No data found" });
    res.json(result);
  });
});

// 2. Get Exam Timetable (For Student View)
app.get("/api/student/timetable", (req, res) => {
  // Sort by date/time so it looks nice
  const sql = "SELECT * FROM exam_timetable ORDER BY exam_date, time_slot";
  
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

app.listen(3000, () => {
  console.log("🚀 Auth & Student Server running on http://localhost:3000");
});
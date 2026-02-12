const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");

const app = express();
const PORT = 3000; 

// ===== Middleware =====
app.use(cors());
app.use(express.json());

// ===== Database =====
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "KARTmysql@18",
  database: "attendance_system"
});

db.connect(() => console.log("✅ DB Connected"));

// ===== Multer =====
const upload = multer({ dest: "uploads/" });

// ================= TIMETABLE =================
app.post("/upload-timetable", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "CSV missing" });

    const csvText = fs.readFileSync(req.file.path, "utf8");
    const lines = csvText.trim().split("\n");

    await db.promise().query("DELETE FROM exam_timetable"); // clear old data

    let inserted = 0;

    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(",");
      if (cols.length < 7) continue;

      const [session_type, day, session, time_slot, subject_code, subject_name, scheme] = cols;

      await db.promise().query(
        `INSERT INTO exam_timetable
        (session_type, day, session, time_slot, subject_code, subject_name, scheme)
        VALUES (?,?,?,?,?,?,?)`,
        [
          session_type.trim(),
          day.trim(),
          session.trim(),
          time_slot.trim(),
          subject_code.trim(),
          subject_name.trim(),
          scheme.trim()
        ]
      );

      inserted++;
    }

    res.json({ message: "Timetable uploaded", inserted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upload failed" });
  }
});

// GET timetable
app.get("/timetable", (req, res) => {
  db.query("SELECT * FROM exam_timetable", (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

// ================= SEATING =================
app.post("/upload-seating", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "CSV missing" });

    await db.promise().query("DELETE FROM seating_chart");

    const csvText = fs.readFileSync(req.file.path, "utf8");
    const lines = csvText.trim().split(/\r?\n/);

    let inserted = 0;

    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(",").map(c => c.replace(/"/g, "").trim());
      if (cols.length < 4) continue;

      const [_, seat_no, course, subject_code, institute_code] = cols;

      await db.promise().query(
        `INSERT INTO seating_chart (seat_no, course, subject_code, institute_code)
        VALUES (?,?,?,?)`,
        [seat_no, course, subject_code, institute_code]
      );

      inserted++;
    }

    res.json({ message: "Seating CSV uploaded", inserted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/seating-chart", (req, res) => {
  db.query("SELECT * FROM seating_chart", (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

// ================= MARKSHEET =================
app.post("/upload-marksheet", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "CSV missing" });

    await db.promise().query("DELETE FROM marksheet");

    const csvText = fs.readFileSync(req.file.path, "utf8");
    const lines = csvText.trim().split("\n");

    let inserted = 0;

    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(",");
      if (cols.length < 6) continue;

      const [sr, marksheet_no, subject_abb, course, subject_code, institute_code] = cols;

      await db.promise().query(
        `INSERT INTO marksheet (marksheet_no, subject_abb, course, subject_code, institute_code)
        VALUES (?,?,?,?,?)`,
        [marksheet_no.trim(), subject_abb.trim(), course.trim(), subject_code.trim(), institute_code.trim()]
      );

      inserted++;
    }

    res.json({ message: "Marksheet CSV uploaded", inserted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/marksheet", (req, res) => {
  db.query("SELECT * FROM marksheet", (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

/// ================= INVENTORY =================

// UPLOAD INVENTORY CSV
app.post("/upload-inventory", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "CSV missing" });

    // Clear old inventory
    await db.promise().query("DELETE FROM paper_inventory");

    const csvText = fs.readFileSync(req.file.path, "utf8");
    const lines = csvText.trim().split(/\r?\n/);

    let inserted = 0;

    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(",").map(c => c.replace(/"/g, "").trim());
      if (cols.length < 4) continue;

      const [subject_code, appearing_students, no_of_packets, institute_code] = cols;

      await db.promise().query(
        `INSERT INTO paper_inventory (subject_code, appearing_students, no_of_packets, institute_code)
         VALUES (?, ?, ?, ?)`,
        [subject_code, appearing_students, no_of_packets, institute_code]
      );

      inserted++;
    }

    res.json({ message: "✅ Inventory CSV uploaded", inserted });
  } catch (err) {
    console.error("Inventory Upload Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// FETCH INVENTORY
app.get("/inventory", async (req, res) => {
  try {
    const [rows] = await db.promise().query("SELECT * FROM paper_inventory");
    res.json(rows);
  } catch (err) {
    console.error("Inventory Fetch Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ================= EXTRA PAPER =================
app.post("/extra-paper", (req, res) => {
  const { subject_code, quantity } = req.body;
  db.query(
    "INSERT INTO extra_paper (subject_code, quantity) VALUES (?,?)",
    [subject_code, quantity],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Record added" });
    }
  );
});

app.get("/extra-paper", (req, res) => {
  db.query("SELECT * FROM extra_paper", (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

// ================= DETAINED =================
app.get("/detained", (req, res) => {
  db.query("SELECT * FROM detained_students", (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

app.post("/detained", (req, res) => {
  const { seat_no } = req.body;
  db.query("INSERT INTO detained_students(seat_no) VALUES(?)", [seat_no], () => {
    res.json({ message: "Added" });
  });
});

app.delete("/detained/:id", (req, res) => {
  db.query("DELETE FROM detained_students WHERE id=?", [req.params.id], () => {
    res.json({ message: "Deleted" });
  });
});

app.delete("/detained-all", (req, res) => {
  db.query("DELETE FROM detained_students", () => {
    res.json({ message: "All deleted" });
  });
});

// ================= STUDENT COUNT REPORT =================
app.get("/student-count-report", (req, res) => {
  const query = `
    SELECT 
      inv.subject_code,
      inv.institute_code,
      inv.appearing_students AS msbte_count,
      IFNULL(seat.seating_count, 0) AS seating_count,
      CASE WHEN inv.appearing_students = IFNULL(seat.seating_count,0)
           THEN 'Matched' ELSE 'Not Matched' END AS status
    FROM paper_inventory inv
    LEFT JOIN (
      SELECT subject_code, institute_code, COUNT(*) AS seating_count
      FROM seating_chart
      GROUP BY subject_code, institute_code
    ) seat
    ON inv.subject_code = seat.subject_code AND inv.institute_code = seat.institute_code
    ORDER BY inv.subject_code
  `;

  db.query(query, (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

// ================= DATA ENTRIES DELETE =================
app.delete("/data_entries/:id", (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM data_entries WHERE id=?", [id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Data entry deleted successfully" });
  });
});

// ================= SUBJECT CODES =================
app.post("/subject-codes", (req, res) => {
  const { subject_code } = req.body;
  if (!subject_code) return res.status(400).json("Subject code required");
  db.query("INSERT INTO subject_sections (subject_code) VALUES (?)", [subject_code], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Subject Code Added" });
  });
});

app.get("/subject-codes", (req, res) => {
  db.query("SELECT * FROM subject_sections", (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

app.delete("/subject-codes/:id", (req, res) => {
  db.query("DELETE FROM subject_sections WHERE id=?", [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Deleted" });
  });
});
app.get("/", (req, res) => {
  res.send("🚀 Smart Exam Backend Running");
});
async function loadTimetable() {
  try {
    const res = await axios.get("http://localhost:3000/timetable");
    setTimetable(res.data);
  } catch (err) {
    console.error("Timetable API error:", err.message);
  }
}

// ================= SERVER =================
app.listen(3000, () => {
  console.log("✅ SERVER RUNNING http://localhost:3000");
});

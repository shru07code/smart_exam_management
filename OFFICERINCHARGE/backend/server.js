
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "attendance_system"
});

/* ================= BLOCKS ================= */

// GET all blocks
app.get("/api/blocks", (req, res) => {
  db.query("SELECT * FROM blocks1 ORDER BY id DESC", (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

// ADD block
app.post("/api/blocks", (req, res) => {
  const { name, location, column_breaks } = req.body;
  if (!name || !location) {
    return res.status(400).json({ error: "Name and location required" });
  }

  const cols = Array.isArray(column_breaks) ? [...column_breaks] : [];
  while (cols.length < 10) cols.push(0);

  const sql = `
    INSERT INTO blocks1
    (name, location, col1, col2, col3, col4, col5, col6, col7, col8, col9, col10)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [name, location, ...cols], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ success: true, id: result.insertId });
  });
});

// UPDATE block
app.put("/api/blocks/:id", (req, res) => {
  const { name, location, column_breaks } = req.body;

  const cols = Array.isArray(column_breaks) ? [...column_breaks] : [];
  while (cols.length < 10) cols.push(0);

  const sql = `
    UPDATE blocks1 SET
    name=?, location=?,
    col1=?, col2=?, col3=?, col4=?, col5=?,
    col6=?, col7=?, col8=?, col9=?, col10=?
    WHERE id=?
  `;

  db.query(sql, [name, location, ...cols, req.params.id], err => {
    if (err) return res.status(500).json(err);
    res.json({ success: true });
  });
});

// DELETE block

app.delete("/api/blocks/:id", (req, res) => {
    const sql = "DELETE FROM blocks1 WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Block deleted" });
    });
});

// GET block location by ID (FIXED TABLE NAME)

app.get("/api/block/:id", (req, res) => {
    const sql = "SELECT * FROM blocks1 WHERE id = ?";
    db.query(sql, [req.params.id], (err, rows) => {
        if (err) return res.status(500).json(err);
        if (rows.length === 0) return res.status(404).json({error: "Block not found"});
        res.json(rows[0]);
    });
});

/* ================= OTHER TABLES ================= */

app.get("/api/marksheet", (req, res) => {
  db.query("SELECT * FROM marksheet", (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});


// FIX: Get distinct institutes from the Seating Chart or Timetable
app.get("/api/institutes", (req, res) => {
  // We select distinct codes so we don't get duplicates
  db.query("SELECT DISTINCT institute_code FROM seating_chart", (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

app.get("/api/supervisor", (req, res) => {
  db.query("SELECT * FROM supervisors", (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

app.get("/api/paper_inventory", (req, res) => {
  db.query("SELECT * FROM paper_inventory", (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

app.get("/api/exam_timetable", (req, res) => {
  db.query("SELECT * FROM exam_timetable", (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

app.get("/api/seating_chart", (req, res) => {
  db.query("SELECT * FROM seating_chart", (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

// Schemes
app.get("/api/schemes", async (req, res) => {
  try {
    const [rows] = await db.promise().query(
      "SELECT DISTINCT scheme FROM exam_timetable ORDER BY scheme"
    );
    res.json(rows);
  } catch {
    res.status(500).json({ error: "Failed to load schemes" });
  }
});


// ================= BLOCK ALLOCATION =================

// 1. SAVE ARRANGEMENT (The Missing API)
app.post("/api/save-arrangement", (req, res) => {
    // 1. Receive subjectName from frontend
    const { date, session, blockId, institute, course, subject, subjectName, startSeat, endSeat, total } = req.body;

    const sql = `
        INSERT INTO block_allocation 
        (exam_date, session, block_id, institute_code, course, subject_code, subject_name, start_seat_no, end_seat_no, total_students)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [date, session, blockId, institute, course, subject, subjectName, startSeat, endSeat, total], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Database error", details: err.sqlMessage });
        }
        res.json({ message: "Saved", id: result.insertId });
    });
});
// 2. GET ALLOCATIONS (To show history)
app.get("/api/allocations", (req, res) => {
  const sql = `
    SELECT ba.*, b.name as block_name, b.location 
    FROM block_allocation ba 
    JOIN blocks1 b ON ba.block_id = b.id 
    ORDER BY ba.id DESC
  `;
  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

// 3. DELETE ALLOCATION
app.delete("/api/allocations/:id", (req, res) => {
  const sql = "DELETE FROM block_allocation WHERE id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Deleted" });
  });
});
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


// ✅ ADD THIS MISSING ROUTE for Courses
app.get("/api/courses", (req, res) => {
  // Fetches distinct courses from your exam timetable or marksheet
  const sql = "SELECT DISTINCT course FROM marksheet ORDER BY course";
  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

// ... existing code ...

// ✅ NEW API: Get distinct setup data from MARKSHEET
app.get("/api/setup-options", (req, res) => {
    // We select distinct values to populate dropdowns
    const sql = "SELECT DISTINCT institute_code, course, subject_code, subject_abb FROM marksheet ORDER BY course, subject_code";
    
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching setup options:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(results);
    });
});
// ================= REPORT: BENCH ARRANGEMENT (UPDATED) =================
// ================= REPORT: BENCH ARRANGEMENT (UPDATED WITH SUBJECT) =================
app.get('/api/bench_arrangement', (req, res) => {
    const { block, date, session } = req.query;

    // 1. Fetch System Settings
    const settingsSql = "SELECT setting_key, setting_value FROM system_settings";
    
    db.query(settingsSql, (err, settingRows) => {
        if (err) return res.status(500).json({ error: "Database error" });

        const settings = {};
        settingRows.forEach(row => { settings[row.setting_key] = row.setting_value; });

        // 2. Fetch Allocation Data (NOW INCLUDES subject_name)
        const sql = `
            SELECT 
                ba.start_seat_no, 
                ba.end_seat_no, 
                ba.course, 
                ba.subject_name,  -- ✅ Added Column
                ba.subject_code,  -- ✅ Added Column
                b.name as block_name,
                b.location
            FROM block_allocation ba
            JOIN blocks1 b ON ba.block_id = b.id
            WHERE b.name = ? AND ba.exam_date = ? AND ba.session = ?
        `;

        db.query(sql, [block, date, session], (err, results) => {
            if (err) return res.status(500).json({ error: "Database error" });

            if (results.length === 0) return res.json({ header: {}, seats: [] });

            // 3. Create a nice string like: "K-Scheme - English (315323)"
            const coursesSet = new Set(results.map(r => {
                const sub = r.subject_name ? ` - ${r.subject_name}` : "";
                const code = r.subject_code ? ` (${r.subject_code})` : "";
                return `${r.course}${sub}${code}`;
            }));

            const header = {
                examination: settings.exam_season || "Summer-2026", 
                room_no: results[0].location,
                date: date,
                session: session,
                exam_center: settings.center_name || "Government Polytechnic", 
                center_code: settings.center_code || "0000",
                courses: [...coursesSet].join(", ") // ✅ Shows Full Subject Info
            };

            let seats = [];
            let benchCounter = 1;
            results.forEach(row => {
                const start = parseInt(row.start_seat_no);
                const end = parseInt(row.end_seat_no);
                for(let i = start; i <= end; i++) {
                    seats.push({ bench: benchCounter++, seat: i, course: row.course });
                }
            });

            res.json({ header, seats });
        });
    });
});
// ================= SUPERVISOR ALLOCATION APIs =================

// 1. GET SUPERVISORS (Source List)
app.get("/api/supervisor-allocations", (req, res) => {
    const { date, session } = req.query;
    
    // We join block_allocation specifically to get the Subject Name
    const sql = `
        SELECT 
            sa.id, 
            b.name as block_name,
            s.name as supervisor_name,
            r.name as reliever_name,
            ba.course,
            ba.subject_name
        FROM supervisor_allocation sa
        JOIN blocks1 b ON sa.block_id = b.id
        JOIN supervisors s ON sa.supervisor_id = s.id
        LEFT JOIN supervisors r ON sa.reliever_id = r.id
        -- JOIN to find which exam is in this block
        LEFT JOIN block_allocation ba ON (ba.block_id = sa.block_id AND ba.exam_date = sa.exam_date AND ba.session = sa.session)
        WHERE sa.exam_date = ? AND sa.session = ?
    `;
    
    db.query(sql, [date, session], (err, rows) => {
        if (err) return res.status(500).json(err);
        res.json(rows);
    });
});

// 2. SAVE ALLOCATION (Destination Table)
app.post("/api/allocate-supervisor", (req, res) => {
    const { date, session, blockId, supId, relId } = req.body;
    
    const sql = `
        INSERT INTO supervisor_allocation (exam_date, session, block_id, supervisor_id, reliever_id) 
        VALUES (?, ?, ?, ?, ?)
    `;
    
    // If relId is empty string "", change it to null for database
    const reliever = relId ? relId : null;

    db.query(sql, [date, session, blockId, supId, reliever], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json({ message: "Saved successfully", id: result.insertId });
    });
});


// ================= SUPERVISOR ALLOCATION APIs =================

// 1. GET SUPERVISORS (Source List)
app.get("/api/supervisors-list", (req, res) => {
    // Fetches from the 'supervisors' table shown in your screenshot
    db.query("SELECT * FROM supervisors", (err, rows) => {
        if (err) return res.status(500).json(err);
        res.json(rows);
    });
});

// 2. SAVE ALLOCATION (Destination Table)
app.post("/api/allocate-supervisor", (req, res) => {
    const { date, session, blockId, supId, relId } = req.body;
    
    const sql = `
        INSERT INTO supervisor_allocation (exam_date, session, block_id, supervisor_id, reliever_id) 
        VALUES (?, ?, ?, ?, ?)
    `;
    
    // If relId is empty string "", change it to null for database
    const reliever = relId ? relId : null;

    db.query(sql, [date, session, blockId, supId, reliever], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json({ message: "Saved successfully", id: result.insertId });
    });
});

// 3. GET ALLOCATIONS (For the Table View)
app.get("/api/supervisor-allocations", (req, res) => {
    const { date, session } = req.query;
    const sql = `
        SELECT 
            sa.id, 
            b.name as block_name,
            s.name as supervisor_name,
            r.name as reliever_name
        FROM supervisor_allocation sa
        JOIN blocks1 b ON sa.block_id = b.id
        JOIN supervisors s ON sa.supervisor_id = s.id
        LEFT JOIN supervisors r ON sa.reliever_id = r.id
        WHERE sa.exam_date = ? AND sa.session = ?
    `;
    
    db.query(sql, [date, session], (err, rows) => {
        if (err) return res.status(500).json(err);
        res.json(rows);
    });
});

// 4. DELETE ALLOCATION
app.delete("/api/supervisor-allocations/:id", (req, res) => {
    const sql = "DELETE FROM supervisor_allocation WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Deleted" });
    });
});
// ================= REPORT: SUPERVISOR ALLOCATION =================
app.get("/api/report/supervisor-allocation", (req, res) => {
    const { date, session } = req.query;

    const sql = `
        SELECT 
            b.name AS block_no,
            b.location AS block_location,
            s.name AS supervisor_name,
            
            -- Get Exam Details from Block Allocation
            ba.institute_code,
            ba.course,
            ba.subject_name,
            ba.subject_code,
            ba.start_seat_no,
            ba.end_seat_no,
            ba.total_students
            
        FROM supervisor_allocation sa
        JOIN blocks1 b ON sa.block_id = b.id
        JOIN supervisors s ON sa.supervisor_id = s.id
        
        -- Join Block Allocation to get Course/Subject details for this specific block/date
        LEFT JOIN block_allocation ba ON (
            sa.block_id = ba.block_id AND 
            DATE(sa.exam_date) = DATE(ba.exam_date) AND 
            sa.session = ba.session
        )
        
        WHERE sa.exam_date = ? AND sa.session = ?
    `;

    db.query(sql, [date, session], (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(rows);
    });
});
// ================= REPORT: ADVANCE Q PAPER (FINAL & ROBUST) =================
app.get("/api/report/advance-qp", (req, res) => {
    const { date } = req.query; 

    const sql = `
        SELECT 
            et.session,
            et.scheme AS master_code,
            et.subject_name,
            et.subject_code,
            COALESCE(pi.quantity, 0) AS no_of_packets 
        FROM exam_timetable et
        LEFT JOIN paper_inventory pi ON et.subject_code = pi.subject_code
        
        -- ✅ FIX: Using CAST to strictly compare YYYY-MM-DD string
        -- This fixes the issue where data exists but doesn't show up
        WHERE CAST(et.exam_date AS CHAR) = ?
        
        ORDER BY et.session ASC, et.subject_code ASC
    `;

    const settingsSql = "SELECT setting_key, setting_value FROM system_settings";

    console.log("Searching for Date:", date); // ✅ Debugging: Check your terminal to see what date is requested

    db.query(sql, [date], (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Database error", details: err.sqlMessage });
        }
        
        // Fetch Settings...
        db.query(settingsSql, (err2, settingRows) => {
            if (err2) return res.status(500).json(err2);
            const settings = {};
            settingRows.forEach(r => settings[r.setting_key] = r.setting_value);
            res.json({ reportData: rows, settings });
        });
    });
});

// ================= SPECIAL CODE ASSIGNMENT (UPDATED) =================

// ================= SPECIAL CODE ASSIGNMENT (FIXED) =================

app.get("/api/special-code-candidates", (req, res) => {
    const { date, session } = req.query;

    console.log(`🔍 Fetching for Date: ${date}, Session: ${session}`); // Debug Log

    // Fix: Add wildcards for fuzzy matching (e.g., "Morning" matches "Morning Session")
    const sessionSearch = `%${session}%`;

    const sql = `
        SELECT 
            sc.seat_no,
            st.full_name AS student_name,
            sc.institute_code,
            sc.course,
            sc.subject_code,
            COALESCE(sca.special_code, 'Present') as current_status
        FROM seating_chart sc
        
        -- 1. JOIN TIMETABLE (Match Date & Partial Session Name)
        JOIN exam_timetable et 
            ON sc.subject_code = et.subject_code
        
        -- 2. JOIN STUDENTS (Get Name)
        LEFT JOIN students st 
            ON sc.seat_no = st.seat_no
        
        -- 3. JOIN SPECIAL CODES
        LEFT JOIN special_code_assignments sca 
            ON sc.seat_no = sca.seat_no 
            AND sca.subject_code = sc.subject_code 
            
        WHERE CAST(et.exam_date AS CHAR) = ? AND et.session_type LIKE ?
        ORDER BY sc.seat_no ASC
    `;

    db.query(sql, [date, sessionSearch], (err, rows) => {
        if (err) {
            console.error("❌ SQL Error:", err.sqlMessage); // Prints exact error in terminal
            return res.status(500).json({ error: err.sqlMessage });
        }
        
        console.log(`✅ Found ${rows.length} students`);
        res.json(rows);
    });
});
// 2. ASSIGN CODE (Save to DB)
app.post("/api/assign-special-code", (req, res) => {
    const { date, session, seat_no, subject_code, special_code } = req.body;
    
    // Using ON DUPLICATE KEY UPDATE to handle re-assignments easily
    const sql = `
        INSERT INTO special_code_assignments (exam_date, session, seat_no, subject_code, special_code)
        VALUES (?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE special_code = VALUES(special_code)
    `;

    db.query(sql, [date, session, seat_no, subject_code, special_code], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json({ message: "Assigned successfully" });
    });
});

// 3. DEASSIGN CODE (Delete from DB)
app.post("/api/deassign-special-code", (req, res) => {
    const { date, session, seat_no } = req.body;
    
    const sql = "DELETE FROM special_code_assignments WHERE exam_date = ? AND session = ? AND seat_no = ?";
    
    db.query(sql, [date, session, seat_no], (err, result) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json({ message: "Deassigned successfully" });
    });
});
// GET report data for Attendance/Supervisor table
app.get("/api/report/block-summary", (req, res) => {
    const { date, session } = req.query;
    
    // We join blocks1 with block_allocation to get the course and institute info
    const sql = `
        SELECT 
            b.id,
            b.name AS block_name,
            ba.institute_code,
            ba.course,
            ba.subject_name,
            ba.start_seat_no,
            ba.end_seat_no,
            ba.total_students
        FROM blocks1 b
        JOIN block_allocation ba ON b.id = ba.block_id
        WHERE ba.exam_date = ? AND ba.session = ?
        ORDER BY b.name ASC
    `;

    db.query(sql, [date, session], (err, rows) => {
        if (err) return res.status(500).json(err);
        res.json(rows);
    });
});
// ================= REPORT: NIL REPORT =================
app.get("/api/report/nil-report", (req, res) => {
    const { date, session } = req.query;

    const sql = `
        SELECT 
            et.scheme,
            et.subject_name,
            et.subject_code,
            COALESCE(pi.quantity, 0) as no_of_packets
        FROM exam_timetable et
        LEFT JOIN paper_inventory pi ON et.subject_code = pi.subject_code
        WHERE et.exam_date = ? AND et.session_type = ?
    `;

    db.query(sql, [date, session], (err, rows) => {
        if (err) {
            console.error("❌ SQL Error:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(rows);
    });
});

// ================= REPORT: ANNEXURE G (Bundle Receipt) =================
app.get("/api/report/annexure-g", (req, res) => {
    const { date } = req.query;

    const sql = `
        SELECT 
            et.subject_name,
            et.subject_code,
            et.session_type AS session,
            COALESCE(pi.quantity, 0) AS total_packets,
            -- Calculating bundles (e.g., 1 bundle per subject for demo)
            CASE WHEN pi.quantity > 0 THEN 1 ELSE 0 END AS total_bundles
        FROM exam_timetable et
        LEFT JOIN paper_inventory pi ON et.subject_code = pi.subject_code
        WHERE et.exam_date = ?
    `;

    db.query(sql, [date], (err, rows) => {
        if (err) {
            console.error("❌ SQL Error:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(rows);
    });
});

// ================= REPORT: ANNEXURE-H (QP Receipt) =================
app.get("/api/report/annexure-h", (req, res) => {
    const { date } = req.query;

    const sql = `
        SELECT 
            et.session_type AS session,
            et.subject_code,
            COALESCE(pi.quantity, 0) AS total_packets
        FROM exam_timetable et
        LEFT JOIN paper_inventory pi ON et.subject_code = pi.subject_code
        WHERE et.exam_date = ?
        ORDER BY et.session_type DESC, et.subject_code ASC
    `;

    db.query(sql, [date], (err, rows) => {
        if (err) return res.status(500).json({ error: "Database error" });
        
        // Group data by session for the table layout
        const grouped = rows.reduce((acc, row) => {
            if (!acc[row.session]) acc[row.session] = { codes: [], counts: [] };
            acc[row.session].codes.push(row.subject_code);
            acc[row.session].counts.push(row.total_packets);
            return acc;
        }, {});

        res.json(grouped);
    });
});
app.get("/api/report/blank-present-absent", (req, res) => {
    const { date } = req.query;
    const sql = `
        SELECT 
            b.name AS block_name,
            b.location,
            s.name AS supervisor_name,
            ba.course,
            ba.subject_code
        FROM blocks1 b
        LEFT JOIN supervisor_allocation sa ON b.id = sa.block_id AND sa.exam_date = ?
        LEFT JOIN supervisors s ON sa.supervisor_id = s.id
        LEFT JOIN block_allocation ba ON b.id = ba.block_id AND ba.exam_date = ?
        ORDER BY b.name ASC
    `;
    db.query(sql, [date, date], (err, rows) => {
        if (err) return res.status(500).json(err);
        res.json(rows);
    });
});

// ================= REPORT: PANCHANAMA (Format 22) =================
app.get("/api/report/panchanama", (req, res) => {
    const { date, session } = req.query;

    // We join timetable with inventory to get the expected subjects and actual packets received
    const sql = `
        SELECT 
            et.subject_code,
            COALESCE(pi.quantity, 0) AS actual_packets
        FROM exam_timetable et
        LEFT JOIN paper_inventory pi ON et.subject_code = pi.subject_code
        WHERE et.exam_date = ? AND et.session_type LIKE ?
    `;

    const sessionSearch = `%${session}%`;

    db.query(sql, [date, sessionSearch], (err, rows) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json(rows);
    });
});
// ================= REPORT: GATE CHART =================
app.get("/api/report/gate-chart", (req, res) => {
    const { date, session } = req.query;
    const sessionSearch = `%${session}%`;

    const sql = `
        SELECT 
            b.name AS block_name,
            ba.institute_code,
            ba.course,
            ba.subject_name,
            ba.subject_code,
            et.time_slot AS exam_time,
            ba.start_seat_no,
            ba.end_seat_no,
            ba.total_students
        FROM block_allocation ba
        JOIN blocks1 b ON ba.block_id = b.id
        LEFT JOIN exam_timetable et ON ba.subject_code = et.subject_code AND ba.exam_date = et.exam_date
        WHERE ba.exam_date = ? AND ba.session LIKE ?
        ORDER BY b.name ASC
    `;

    db.query(sql, [date, sessionSearch], (err, rows) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json(rows);
    });
});

// ================= REPORT: NIL REPORT =================
app.get("/api/report/nil-report", (req, res) => {
    const { date, session } = req.query;

    const sql = `
        SELECT 
            et.scheme,
            et.subject_name,
            et.subject_code,
            COALESCE(pi.quantity, 0) as no_of_packets
        FROM exam_timetable et
        LEFT JOIN paper_inventory pi ON et.subject_code = pi.subject_code
        WHERE et.exam_date = ? AND et.session_type = ?
    `;

    db.query(sql, [date, session], (err, rows) => {
        if (err) {
            console.error("❌ SQL Error:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(rows);
    });
});

// ================= API: PACKING SLIP DATA =================
app.get("/api/packing-slip-summary", (req, res) => {
    const { date, session } = req.query;
    const sessionSearch = `%${session}%`;

    const sql = `
        SELECT 
            m.institute_code, 
            m.course, 
            m.subject_code,
            COUNT(sc.seat_no) as total_students,
            SUM(CASE WHEN sca.special_code IS NULL THEN 1 ELSE 0 END) as present_count,
            SUM(CASE WHEN sca.special_code IS NOT NULL THEN 1 ELSE 0 END) as absent_count
        FROM marksheet m
        LEFT JOIN seating_chart sc ON m.subject_code = sc.subject_code
        LEFT JOIN special_code_assignments sca ON sc.seat_no = sca.seat_no AND sc.subject_code = sca.subject_code
        JOIN exam_timetable et ON m.subject_code = et.subject_code
        WHERE et.exam_date = ? AND et.session_type LIKE ?
        GROUP BY m.institute_code, m.course, m.subject_code
    `;

    db.query(sql, [date, sessionSearch], (err, rows) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json(rows);
    });
});

// ✅ API: Fetch Data for Format-07 (Receipt of Answer Books)
app.get("/api/report/format-07", (req, res) => {
    const { date, session } = req.query;
    
    // Using LIKE to handle "Morning" vs "Morning Session"
    const sessionSearch = `%${session}%`; 

    const sql = `
        SELECT 
            m.course, 
            et.subject_name, 
            m.subject_code,
            COUNT(sc.seat_no) as student_count
        FROM marksheet m
        JOIN exam_timetable et ON m.subject_code = et.subject_code
        LEFT JOIN seating_chart sc ON m.subject_code = sc.subject_code
        WHERE et.exam_date = ? AND et.session_type LIKE ?
        GROUP BY m.subject_code, m.course, et.subject_name
    `;

    db.query(sql, [date, sessionSearch], (err, rows) => {
        if (err) {
            console.error("❌ SQL Error in Format-07:", err.message);
            return res.status(500).json({ success: false, error: err.message });
        }
        res.json(rows);
    });
});

// ✅ API: Fetch Data for Format-08 (Receipt of Answer Books)
app.get("/api/report/format-08", (req, res) => {
    const { date, session } = req.query;
    
    // Using LIKE to handle "Morning" vs "Morning Session" mismatch
    const sessionSearch = `%${session}%`; 

    const sql = `
        SELECT 
            m.course, 
            et.subject_name, 
            m.subject_code,
            COUNT(sc.seat_no) as total_students,
            SUM(CASE WHEN sca.special_code IS NULL THEN 1 ELSE 0 END) as present_count
        FROM marksheet m
        JOIN exam_timetable et ON m.subject_code = et.subject_code
        LEFT JOIN seating_chart sc ON m.subject_code = sc.subject_code
        LEFT JOIN special_code_assignments sca ON sc.seat_no = sca.seat_no AND sc.subject_code = sca.subject_code
        WHERE et.exam_date = ? AND et.session_type LIKE ?
        GROUP BY m.subject_code, m.course, et.subject_name
    `;

    db.query(sql, [date, sessionSearch], (err, rows) => {
        if (err) {
            console.error("❌ SQL Error in Format-08:", err.message);
            return res.status(500).json({ success: false, error: err.message });
        }
        res.json(rows);
    });
});

// ✅ API: Fetch Question Paper Record Data
app.get("/api/report/question-paper-record", (req, res) => {
    const { date } = req.query;

    const sql = `
        SELECT 
            et.scheme, 
            et.subject_abbreviation, 
            et.subject_code AS question_paper_code,
            COALESCE(pi.received, 0) AS received,
            COALESCE(pi.used, 0) AS used,
            COALESCE(pi.rac, 0) AS rac
        FROM exam_timetable et
        LEFT JOIN paper_inventory pi ON et.subject_code = pi.subject_code
        WHERE et.exam_date = ?
    `;

    db.query(sql, [date], (err, rows) => {
        if (err) return res.status(500).json({ success: false, error: err.message });
        res.json(rows);
    });
});

// const express = require('express');
// const mysql = require('mysql2');
// const cors = require('cors');
// const bodyParser = require('body-parser');
// const bcrypt = require('bcrypt');

// const app = express();
// const PORT = 3000;

// // ------------------- Middleware -------------------
// app.use(cors());
// app.use(express.json()); // for parsing application/json

// // ------------------- MySQL Connection -------------------
// const db = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',       // your MySQL username
//   password: '',// your MySQL password
//   database: 'attendance_system'
// });

// db.connect(err => {
//   if(err) { 
//     console.error('DB connection error:', err); 
//     return; 
//   }
//   console.log('Connected to MySQL!');
// });
// // ---------- Officer Incharge Routes ----------
// app.get('/api/officers', (req, res) => {
//   db.query('SELECT * FROM officers ORDER BY id DESC', (err, results) => {
//     if(err) return res.status(500).json({ error: err });
//     res.json(results);
//   });
// });

// app.get('/api/officers/:id', (req, res) => {
//   db.query('SELECT * FROM officers WHERE id=?', [req.params.id], (err, results) => {
//     if(err) return res.status(500).json({ error: err });
//     res.json(results[0]);
//   });
// });

// app.post('/api/officers', (req, res) => {
//   const { username, password } = req.body;
//   if(!username || !password) return res.status(400).json({ error: 'Username and Password required' });

//   const sql = 'INSERT INTO officers (username, password) VALUES (?, ?)';
//   db.query(sql, [username, password], (err, result) => {
//     if(err) return res.status(500).json({ error: err });
//     res.json({ success: true, id: result.insertId });
//   });
// });

// app.put('/api/officers/:id', (req, res) => {
//   const { username, password } = req.body;
//   const sql = 'UPDATE officers SET username=?, password=? WHERE id=?';
//   db.query(sql, [username, password, req.params.id], (err) => {
//     if(err) return res.status(500).json({ error: err });
//     res.json({ success: true });
//   });
// });

// app.delete('/api/officers/:id', (req, res) => {
//   db.query('DELETE FROM officers WHERE id=?', [req.params.id], (err) => {
//     if(err) return res.status(500).json({ error: err });
//     res.json({ success: true });
//   });
// });
// // ===================== LOGIN SYSTEM =====================
// app.post('/api/login', (req, res) => {
//   const { role, username, password } = req.body;

//   if (!username || !password) {
//     return res.json({ success: false, message: 'Missing credentials' });
//   }

//   db.query('SELECT * FROM admins WHERE username = ?', [username], async (err, results) => {
//     if (err) return res.json({ success: false, message: 'Database error' });

//     if (results.length === 0) {
//       return res.json({ success: false, message: 'User not found' });
//     }

//     const user = results[0];

//     const match = await bcrypt.compare(password, user.password_hash);

//     if (!match) {
//       return res.json({ success: false, message: 'Wrong password' });
//     }

//     res.json({ success: true, role });
//   });
// });

// // ---------- Data Entry Routes ----------
// app.get('/api/data', (req, res) => {
//   db.query('SELECT * FROM data_entries ORDER BY id DESC', (err, results) => {
//     if(err) return res.status(500).json({ error: err });
//     res.json(results);
//   });
// });

// app.get('/api/data/:id', (req, res) => {
//   db.query('SELECT * FROM data_entries WHERE id=?', [req.params.id], (err, results) => {
//     if(err) return res.status(500).json({ error: err });
//     res.json(results[0]);
//   });
// });

// // app.post('/api/data', (req, res) => {
// //   const { username, password } = req.body;
// //   if(!username || !password) return res.status(400).json({ error: 'Username and Password required' });

// //   const sql = 'INSERT INTO data_entries (username, password) VALUES (?, ?)';
// //   db.query(sql, [username, password], (err, result) => {
// //     if(err) return res.status(500).json({ error: err });
// //     res.json({ success: true, id: result.insertId });
// //   });
// // });
// app.post('/api/data', async (req, res) => {
//   const { username, password } = req.body;
//   const hash = await bcrypt.hash(password, 10);

//   db.query(
//     'INSERT INTO data_entries (username, password) VALUES (?, ?)',
//     [username, hash],
//     (err, result) => {
//       if (err) return res.status(500).json({ error: err });
//       res.json({ success: true, id: result.insertId });
//     }
//   );
// });


// app.put('/api/data/:id', (req, res) => {
//   const { username, password } = req.body;
//   const sql = 'UPDATE data_entries SET username=?, password=? WHERE id=?';
//   db.query(sql, [username, password, req.params.id], (err) => {
//     if(err) return res.status(500).json({ error: err });
//     res.json({ success: true });
//   });
// });

// app.delete('/api/data/:id', (req, res) => {
//   db.query('DELETE FROM data_entries WHERE id=?', [req.params.id], (err) => {
//     if(err) return res.status(500).json({ error: err });
//     res.json({ success: true });
//   });
// });
// // ---------- Billing Routes ----------
// app.get('/api/billing_records', (req, res) => {
//   db.query('SELECT * FROM billing_records ORDER BY id DESC', (err, results) => {
//     if(err) return res.status(500).json({ error: err });
//     res.json(results);
//   });
// });

// app.get('/api/billing_records/:id', (req, res) => {
//   db.query('SELECT * FROM billing_records WHERE id=?', [req.params.id], (err, results) => {
//     if(err) return res.status(500).json({ error: err });
//     res.json(results[0]);
//   });
// });

// app.post('/api/billing_records', (req, res) => {
//   const { username, password } = req.body;
//   if(!username || !password) return res.status(400).json({ error: 'Username and Password required' });

//   const sql = 'INSERT INTO billing_records (username, password) VALUES (?, ?)';
//   db.query(sql, [username, password], (err, result) => {
//     if(err) return res.status(500).json({ error: err });
//     res.json({ success: true, id: result.insertId });
//   });
// });

// app.put('/api/billing_records/:id', (req, res) => {
//   const { username, password } = req.body;
//   const sql = 'UPDATE billing_records SET username=?, password=? WHERE id=?';
//   db.query(sql, [username, password, req.params.id], (err) => {
//     if(err) return res.status(500).json({ error: err });
//     res.json({ success: true });
//   });
// });

// app.delete('/api/billing_records/:id', (req, res) => {
//   db.query('DELETE FROM billing_records WHERE id=?', [req.params.id], (err) => {
//     if(err) return res.status(500).json({ error: err });
//     res.json({ success: true });
//   });
// });
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');
const multer = require('multer');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
require('dotenv').config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 3000;

// ------------------- Middleware -------------------
app.use(cors());
app.use(express.json());

// ------------------- Multer Setup -------------------
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// ------------------- MySQL Connection -------------------
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'attendance_system',
  port: process.env.DB_PORT || 3306
});

db.connect(err => {
  if(err){ 
    console.error('DB connection error:', err); 
    return; 
  }
  console.log('Connected to MySQL!');
});

// ================= LOGIN SYSTEM =================
app.post('/api/login', (req, res) => {
  const { role, username, password } = req.body;
  if(!role || !username || !password) return res.status(400).json({ success:false, message:"Fill all fields" });

  let table = '';
  if(role==='superadmin') table='admins';
  else if(role==='dataentry') table='data_entries';
  else if(role==='billing') table='billing_records';
  else if(role==='officer') table='officers';
  else if(role==='student') table='students';
  else return res.status(400).json({ success:false, message:"Invalid role" });

  let queryColumn = 'username';
  if (role === 'student') queryColumn = 'enrollment_no';

  db.query(`SELECT * FROM ${table} WHERE ${queryColumn}=?`, [username], async (err, results) => {
      if(err) return res.status(500).json({ success:false, message:'Server error' });
      if(results.length===0) return res.status(401).json({ success:false, message:'User not found' });

      const user = results[0];
      
      // Safety check for missing password hash
      if (!user.password_hash) {
          console.error(`Login failed: User ${username} has no password hash set.`);
          return res.status(500).json({ success:false, message:'Account configuration error. Contact admin.' });
      }

      const match = await bcrypt.compare(password, user.password_hash);
      if(!match) return res.status(401).json({ success:false, message:'Wrong password' });

      res.json({ success:true, role });
  });
});

// ================= CRUD FOR OFFICERS =================
app.get('/api/officers', (req, res) => {
  db.query('SELECT * FROM officers ORDER BY id DESC', (err, results) => {
    if(err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

app.get('/api/officers/:id', (req, res) => {
  db.query('SELECT * FROM officers WHERE id=?', [req.params.id], (err, results) => {
    if(err) return res.status(500).json({ error: err });
    res.json(results[0]);
  });
});

app.post('/api/officers', async (req, res) => {
  const { username, password } = req.body;
  if(!username || !password) return res.status(400).json({ error: 'Username & Password required' });

  const hash = await bcrypt.hash(password, 10);

  db.query('INSERT INTO officers (username, password_hash) VALUES (?, ?)', [username, hash], (err, result) => {
    if(err) return res.status(500).json({ error: err });
    res.json({ success: true, id: result.insertId });
  });
});

app.put('/api/officers/:id', async (req, res) => {
  const { username, password } = req.body;
  const hash = await bcrypt.hash(password, 10);

  db.query('UPDATE officers SET username=?, password_hash=? WHERE id=?', [username, hash, req.params.id], (err) => {
    if(err) return res.status(500).json({ error: err });
    res.json({ success: true });
  });
});

app.delete('/api/officers/:id', (req, res) => {
  db.query('DELETE FROM officers WHERE id=?', [req.params.id], (err) => {
    if(err) return res.status(500).json({ error: err });
    res.json({ success: true });
  });
});

// ================= CRUD FOR DATA ENTRIES =================
app.get('/api/data', (req, res) => {
  db.query('SELECT * FROM data_entries ORDER BY id DESC', (err, results) => {
    if(err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

app.post('/api/data', async (req, res) => {
  const { username, password } = req.body;
  const hash = await bcrypt.hash(password, 10);

  db.query('INSERT INTO data_entries (username, password_hash) VALUES (?, ?)', [username, hash], (err, result) => {
    if(err) return res.status(500).json({ error: err });
    res.json({ success: true, id: result.insertId });
  });
});

app.put('/api/data/:id', async (req, res) => {
  const { username, password } = req.body;
  const hash = await bcrypt.hash(password, 10);

  db.query('UPDATE data_entries SET username=?, password_hash=? WHERE id=?', [username, hash, req.params.id], (err) => {
    if(err) return res.status(500).json({ error: err });
    res.json({ success: true });
  });
});

app.delete('/api/data/:id', (req, res) => {
  db.query('DELETE FROM data_entries WHERE id=?', [req.params.id], (err) => {
    if(err) return res.status(500).json({ error: err });
    res.json({ success: true });
  });
});

// ================= CRUD FOR BILLING =================
app.get('/api/billing_records', (req, res) => {
  db.query('SELECT * FROM billing_records ORDER BY id DESC', (err, results) => {
    if(err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

app.post('/api/billing_records', async (req, res) => {
  const { username, password } = req.body;
  const hash = await bcrypt.hash(password, 10);

  db.query('INSERT INTO billing_records (username, password_hash) VALUES (?, ?)', [username, hash], (err, result) => {
    if(err) return res.status(500).json({ error: err });
    res.json({ success: true, id: result.insertId });
  });
});

app.put('/api/billing_records/:id', async (req, res) => {
  const { username, password } = req.body;
  const hash = await bcrypt.hash(password, 10);

  db.query('UPDATE billing_records SET username=?, password_hash=? WHERE id=?', [username, hash, req.params.id], (err) => {
    if(err) return res.status(500).json({ error: err });
    res.json({ success: true });
  });
});

app.delete('/api/billing_records/:id', (req, res) => {
  db.query('DELETE FROM billing_records WHERE id=?', [req.params.id], (err) => {
    if(err) return res.status(500).json({ error: err });
    res.json({ success: true });
  });
});


// ------------------- INSTITUTE ROUTES -------------------
app.get('/api/institutes', (req, res) => {
  db.query('SELECT * FROM institutes ORDER BY id DESC', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

app.get('/api/institutes/:id', (req, res) => {
  db.query('SELECT * FROM institutes WHERE id=?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results[0]);
  });
});



app.put('/api/institutes/:id', (req, res) => {
  const { code, name, address } = req.body;
  db.query('UPDATE institutes SET code=?, name=?, address=? WHERE id=?', [code, name, address, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ success: true });
  });
});

app.delete('/api/institutes/:id', (req, res) => {
  db.query('DELETE FROM institutes WHERE id=?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ success: true });
  });
});
// ---------- ADD INSTITUTE ----------
// app.post('/api/institutes', (req, res) => {
//   const { code, name, address } = req.body;

//   if(!code || !name){
//     return res.status(400).json({
//       success:false,
//       message:'Code and Name required'
//     });
//   }

//   const sql = `
//     INSERT INTO institutes (code, name, address)
//     VALUES (?, ?, ?)
//   `;

//   db.query(sql, [code, name, address], (err, result) => {
//     if(err){
//       console.error(err);
//       return res.status(500).json({ success:false });
//     }

//     res.json({
//       success:true,
//       id: result.insertId
//     });
//   });
// });

app.post('/api/institutes', (req, res) => {
  console.log('Received body:', req.body);
  const { code, name, address } = req.body;

  db.query(
    'INSERT INTO institutes (code, name, address) VALUES (?,?,?)',
    [code, name, address],
    (err, results) => {
      if (err) {
        console.error('MYSQL ERROR:', err);
        return res.status(500).json({ error: err });
      }
      res.json({ success: true, id: results.insertId });
    }
  );
});
// ================= DC APIs =======================
// =================================================

// Get all DCs
app.get('/api/dcs', (req, res) => {
  db.query('SELECT * FROM dcs ORDER BY id DESC', (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Get single DC
app.get('/api/dcs/:id', (req, res) => {
  db.query(
    'SELECT * FROM dcs WHERE id = ?',
    [req.params.id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results[0]);
    }
  );
});

// Add DC  ⭐ IMPORTANT
app.post('/api/dcs', (req, res) => {
  console.log('DC BODY:', req.body);

  const { code, name, address } = req.body;

  if (!code || !name) {
    return res.status(400).json({ error: 'Code & Name required' });
  }

  const sql = 'INSERT INTO dcs (code, name, address) VALUES (?,?,?)';
  db.query(sql, [code, name, address], (err, result) => {
    if (err) {
      console.error('MYSQL ERROR:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json({ success: true, id: result.insertId });
  });
});

// Update DC
app.put('/api/dcs/:id', (req, res) => {
  const { code, name, address } = req.body;

  db.query(
    'UPDATE dcs SET code=?, name=?, address=? WHERE id=?',
    [code, name, address, req.params.id],
    err => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

// Delete DC
app.delete('/api/dcs/:id', (req, res) => {
  db.query(
    'DELETE FROM dcs WHERE id=?',
    [req.params.id],
    err => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});
// ================= EXAM CONTROLLER ROUTES =================

// Get all exam controllers
// Get all exam controllers (DATE FIXED)
app.get('/api/exam-controllers', (req, res) => {
  db.query(
    `SELECT 
        id,
        name,
        qualification,
        designation,
        institute_code,
        institute_name,
        msbte_order_no,
        DATE_FORMAT(order_date, '%Y-%m-%d') AS order_date
     FROM exam_controllers
     ORDER BY id DESC`,
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json(results);
    }
  );
});



// Get single exam controller
// Get single exam controller (FINAL FIX)
app.get('/api/exam-controllers/:id', (req, res) => {
  db.query(
    `SELECT 
        id,
        name,
        qualification,
        designation,
        institute_code,
        institute_name,
        msbte_order_no,
        DATE_FORMAT(order_date, '%Y-%m-%d') AS order_date
     FROM exam_controllers
     WHERE id = ?`,
    [req.params.id],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: err });
      }
      res.json(results[0]);
    }
  );
});


// Add exam controller
app.post('/api/exam-controllers', (req, res) => {
  const {
    name,
    qualification,
    designation,
    institute_code,
    institute_name,
    msbte_order_no,
    order_date
  } = req.body;

  const sql = `
    INSERT INTO exam_controllers
    (name, qualification, designation, institute_code, institute_name, msbte_order_no, order_date)
    VALUES (?,?,?,?,?,?, STR_TO_DATE(?, '%Y-%m-%d'))
  `;

  db.query(
    sql,
    [name, qualification, designation, institute_code, institute_name, msbte_order_no, order_date],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ success: true, id: result.insertId });
    }
  );
});

// Update exam controller
app.put('/api/exam-controllers/:id', (req, res) => {
  const {
    name,
    qualification,
    designation,
    institute_code,
    institute_name,
    msbte_order_no,
    order_date
  } = req.body;

  const sql = `
    UPDATE exam_controllers SET
    name=?,
    qualification=?,
    designation=?,
    institute_code=?,
    institute_name=?,
    msbte_order_no=?,
    order_date = STR_TO_DATE(?, '%Y-%m-%d')

    WHERE id=?
  `;

  db.query(
    sql,
    [
      name,
      qualification,
      designation,
      institute_code,
      institute_name,
      msbte_order_no,
      order_date,
      req.params.id
    ],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ success: true });
    }
  );
});

// Delete exam controller
app.delete('/api/exam-controllers/:id', (req, res) => {
  db.query(
    'DELETE FROM exam_controllers WHERE id=?',
    [req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ success: true });
    }
  );
});


// ------------------- Officer Details APIs -------------------

// ------------------- OFFICER DETAILS ROUTES -------------------

// GET all officer details
app.get('/api/officer-details', (req, res) => {
  db.query(
    'SELECT * FROM officer_details ORDER BY id DESC',
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json(results);
    }
  );
});

// GET officer detail by ID
app.get('/api/officer-details/:id', (req, res) => {
  db.query(
    'SELECT * FROM officer_details WHERE id=?',
    [req.params.id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json(results[0]);
    }
  );
});

// ADD officer detail
app.post('/api/officer-details', (req, res) => {
  console.log('Received officer detail:', req.body);

  const { name, qualification, designation } = req.body;

  db.query(
    'INSERT INTO officer_details (name, qualification, designation) VALUES (?,?,?)',
    [name, qualification, designation],
    (err, results) => {
      if (err) {
        console.error('MYSQL ERROR:', err);
        return res.status(500).json({ error: err });
      }
      res.json({ success: true, id: results.insertId });
    }
  );
});

// UPDATE officer detail
app.put('/api/officer-details/:id', (req, res) => {
  const { name, qualification, designation } = req.body;

  db.query(
    'UPDATE officer_details SET name=?, qualification=?, designation=? WHERE id=?',
    [name, qualification, designation, req.params.id],
    err => {
      if (err) return res.status(500).json({ error: err });
      res.json({ success: true });
    }
  );
});

// DELETE officer detail
app.delete('/api/officer-details/:id', (req, res) => {
  db.query(
    'DELETE FROM officer_details WHERE id=?',
    [req.params.id],
    err => {
      if (err) return res.status(500).json({ error: err });
      res.json({ success: true });
    }
  );
});
// ---------- MSBTE ORDERS ----------
app.get('/api/msbte_orders', (req, res) => {
  db.query(
    'SELECT id, msbte_order, DATE_FORMAT(order_date, "%Y-%m-%d") AS order_date FROM msbte_orders ORDER BY id DESC',
    (e, r) => {
      if (e) return res.status(500).json(e);
      res.json(r);
    }
  );
});

app.get('/api/msbte_orders/:id', (req, res) => {
  db.query(
    'SELECT id, msbte_order, DATE_FORMAT(order_date, "%Y-%m-%d") AS order_date FROM msbte_orders WHERE id=?',
    [req.params.id],
    (e, r) => {
      if (e) return res.status(500).json(e);
      res.json(r[0]);
    }
  );
});

app.post('/api/msbte_orders', (req, res) => {
  const { msbte_order, order_date } = req.body;

  db.query(
    'INSERT INTO msbte_orders (msbte_order, order_date) VALUES (?, ?)',
    [msbte_order, order_date], // ✅ string date only
    e => {
      if (e) return res.status(500).json(e);
      res.json({ success: true });
    }
  );
});
app.put('/api/msbte_orders/:id', (req, res) => {
  const { msbte_order, order_date } = req.body;

  db.query(
    'UPDATE msbte_orders SET msbte_order=?, order_date=? WHERE id=?',
    [
      msbte_order,
      order_date || null, // ✅ prevents invalid date bug
      req.params.id
    ],
    e => {
      if (e) return res.status(500).json(e);
      res.json({ success: true });
    }
  );
});

app.delete('/api/msbte_orders/:id', (req, res) => {
  db.query(
    'DELETE FROM msbte_orders WHERE id=?',
    [req.params.id],
    e => {
      if (e) return res.status(500).json(e);
      res.json({ success: true });
    }
  );
});

// ---------- RAC Q PAPERS ----------
app.get('/api/rac_qpapers',(req,res)=>{
  db.query('SELECT * FROM rac_qpapers',(e,r)=>res.json(r));
});
app.post('/api/rac_qpapers',(req,res)=>{
  db.query('INSERT INTO rac_qpapers (count) VALUES (?)',[req.body.count],()=>res.json({success:true}));
});
app.put('/api/rac_qpapers/:id',(req,res)=>{
  db.query('UPDATE rac_qpapers SET count=? WHERE id=?',[req.body.count,req.params.id],()=>res.json({success:true}));
});
app.delete('/api/rac_qpapers/:id',(req,res)=>{
  db.query('DELETE FROM rac_qpapers WHERE id=?',[req.params.id],()=>res.json({success:true}));
});
// ---------- EXAM NAMES ROUTES ----------

// Get all
app.get('/api/exam_names', (req, res) => {
  db.query('SELECT * FROM exam_names ORDER BY id DESC', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// Get single
app.get('/api/exam_names/:id', (req, res) => {
  db.query('SELECT * FROM exam_names WHERE id=?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results[0]);
  });
});

// Add
app.post('/api/exam_names', (req, res) => {
  console.log('ADD EXAM BODY:', req.body);
  const { name } = req.body;

  db.query(
    'INSERT INTO exam_names (name) VALUES (?)',
    [name],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ success: true, id: result.insertId });
    }
  );
});

// 🔥 UPDATE (THIS WAS MISSING / WRONG)
app.put('/api/exam_names/:id', (req, res) => {
  console.log('UPDATE EXAM BODY:', req.body);

  const { name } = req.body;

  db.query(
    'UPDATE exam_names SET name=? WHERE id=?',
    [name, req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ success: true });
    }
  );
});

// Delete
app.delete('/api/exam_names/:id', (req, res) => {
  db.query(
    'DELETE FROM exam_names WHERE id=?',
    [req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ success: true });
    }
  );
});

// ---------- BACKUP API ----------
app.get('/api/backup', async (req, res) => {
  try {
    const tables = {
      officers: 'officers',
      data_entries: 'data_entries',
      billing_records: 'billing_records',
      dcs: 'dcs',
      officer_details: 'officer_details',
      exam_controllers: 'exam_controllers',
      msbte_orders: 'msbte_orders',
      rac_qpapers: 'rac_qpapers',
      exam_names: 'exam_names'
    };

    const backup = {};

    const getData = table =>
      new Promise((resolve, reject) => {
        db.query(`SELECT * FROM ${table}`, (err, results) => {
          if (err) reject(err);
          else resolve(results);
        });
      });

    for (let key in tables) {
      backup[key] = await getData(tables[key]);
    }

    // 🔥 IMPORTANT CHANGES HERE
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="super_admin_backup.txt"'
    );

    res.send(JSON.stringify(backup, null, 2));

  } catch (err) {
    console.error('BACKUP ERROR:', err);
    res.status(500).json({ error: 'Backup failed' });
  }
});


// ================= STUDENTS CRUD =================
app.get('/api/students', (req, res) => {
  db.query('SELECT * FROM students ORDER BY id DESC', (err, results) => {
    if(err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

app.post('/api/students', async (req, res) => {
  const { full_name, enrollment_no, seat_no, scheme, password } = req.body;
  if(!enrollment_no || !password) return res.status(400).json({ error: 'Enrollment No & Password required' });

  const hash = await bcrypt.hash(password, 10);

  db.query(
    'INSERT INTO students (full_name, enrollment_no, seat_no, scheme, password_hash) VALUES (?, ?, ?, ?, ?)',
    [full_name, enrollment_no, seat_no, scheme, hash],
    (err, result) => {
      if(err) return res.status(500).json({ error: err });
      res.json({ success: true, id: result.insertId });
    }
  );
});

app.put('/api/students/:id', async (req, res) => {
  const { full_name, enrollment_no, seat_no, scheme, password } = req.body;
  
  let sql = 'UPDATE students SET full_name=?, enrollment_no=?, seat_no=?, scheme=?';
  let params = [full_name, enrollment_no, seat_no, scheme];

  if(password) {
    const hash = await bcrypt.hash(password, 10);
    sql += ', password_hash=?';
    params.push(hash);
  }
  
  sql += ' WHERE id=?';
  params.push(req.params.id);

  db.query(sql, params, (err) => {
    if(err) return res.status(500).json({ error: err });
    res.json({ success: true });
  });
});

app.delete('/api/students/:id', (req, res) => {
  db.query('DELETE FROM students WHERE id=?', [req.params.id], (err) => {
    if(err) return res.status(500).json({ error: err });
    res.json({ success: true });
  });
});

// ================= STAFF CRUD =================
app.get('/api/staff', (req, res) => {
  db.query('SELECT * FROM staff ORDER BY id DESC', (err, results) => {
    if(err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

app.post('/api/staff', (req, res) => {
  const { name, role } = req.body;
  db.query('INSERT INTO staff (name, role) VALUES (?, ?)', [name, role], (err, result) => {
    if(err) return res.status(500).json({ error: err });
    res.json({ success: true, id: result.insertId });
  });
});

app.put('/api/staff/:id', (req, res) => {
  const { name, role } = req.body;
  db.query('UPDATE staff SET name=?, role=? WHERE id=?', [name, role, req.params.id], (err) => {
    if(err) return res.status(500).json({ error: err });
    res.json({ success: true });
  });
});

app.delete('/api/staff/:id', (req, res) => {
  db.query('DELETE FROM staff WHERE id=?', [req.params.id], (err) => {
    if(err) return res.status(500).json({ error: err });
    res.json({ success: true });
  });
});


// ================= OFFICER MODULE APIs =================

// ---------- BLOCKS CRUD ----------
app.get('/api/blocks', (req, res) => {
  db.query('SELECT * FROM blocks1 ORDER BY id DESC', (err, results) => {
    if(err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

app.get('/api/block/:id', (req, res) => {
  db.query('SELECT * FROM blocks1 WHERE id=?', [req.params.id], (err, results) => {
    if(err) return res.status(500).json({ error: err });
    res.json(results[0]);
  });
});

app.post('/api/blocks', (req, res) => {
  const { name, location, column_breaks } = req.body;
  if(!name || !location) return res.status(400).json({ error: 'Name & Location required' });

  // Prepare columns (col1 to col10)
  const cols = Array(10).fill(0);
  if(column_breaks && Array.isArray(column_breaks)){
    column_breaks.forEach((val, idx) => { if(idx < 10) cols[idx] = val; });
  }

  const sql = `INSERT INTO blocks1 (name, location, col1, col2, col3, col4, col5, col6, col7, col8, col9, col10) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const params = [name, location, ...cols];

  db.query(sql, params, (err, result) => {
    if(err) return res.status(500).json({ error: err });
    res.json({ success: true, id: result.insertId });
  });
});

app.put('/api/blocks/:id', (req, res) => {
  const { name, location, column_breaks } = req.body;
  
  const cols = Array(10).fill(0);
  if(column_breaks && Array.isArray(column_breaks)){
    column_breaks.forEach((val, idx) => { if(idx < 10) cols[idx] = val; });
  }

  const sql = `UPDATE blocks1 SET name=?, location=?, col1=?, col2=?, col3=?, col4=?, col5=?, col6=?, col7=?, col8=?, col9=?, col10=? WHERE id=?`;
  const params = [name, location, ...cols, req.params.id];

  db.query(sql, params, (err) => {
    if(err) return res.status(500).json({ error: err });
    res.json({ success: true });
  });
});

app.delete('/api/blocks/:id', (req, res) => {
  db.query('DELETE FROM blocks1 WHERE id=?', [req.params.id], (err) => {
    if(err) return res.status(500).json({ error: err });
    res.json({ success: true });
  });
});

// ---------- SETUP OPTIONS (Dropdowns) ----------
app.get('/api/setup-options', (req, res) => {
  db.query('SELECT institute_code, course, subject_code, subject_abb FROM marksheet', (err, results) => {
    if(err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// ---------- BLOCK ARRANGEMENT (Allocations) ----------
app.post('/api/save-arrangement', (req, res) => {
  const { date, session, blockId, institute, course, subject, subjectName, startSeat, endSeat, total } = req.body;
  
  if(!date || !blockId) return res.status(400).json({ error: "Missing required fields" });

  const sql = `
    INSERT INTO block_allocation 
    (exam_date, session, block_id, institute_code, course, subject_code, subject_name, start_seat_no, end_seat_no, total_students)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  const params = [date, session, blockId, institute, course, subject, subjectName, startSeat, endSeat, total];

  db.query(sql, params, (err, result) => {
    if(err) return res.status(500).json({ error: err });
    res.json({ success: true, id: result.insertId });
  });
});

// GET all allocations (for reports)
app.get('/api/allocations', (req, res) => {
    const sql = `
        SELECT 
            ba.id, 
            ba.exam_date, 
            ba.session, 
            b.name as block_name, 
            b.location as block_location, 
            ba.course, 
            ba.subject_name, 
            ba.subject_code 
        FROM block_allocation ba
        JOIN blocks1 b ON ba.block_id = b.id
        ORDER BY ba.exam_date DESC, ba.session, b.name
    `;
    db.query(sql, (err, results) => {
        if(err) return res.status(500).json({ error: err });
        res.json(results);
    });
});

app.delete('/api/allocations/:id', (req, res) => {
  db.query('DELETE FROM block_allocation WHERE id=?', [req.params.id], (err) => {
    if(err) return res.status(500).json({ error: err });
    res.json({ success: true });
  });
});

// ---------- SUPERVISOR ALLOCATION ----------
app.get('/api/supervisors', (req, res) => {
  db.query('SELECT * FROM supervisors', (err, results) => res.json(results || []));
});

// Added alias for compatibility with supervisor-allocation.html
app.get('/api/supervisors-list', (req, res) => {
    db.query('SELECT * FROM supervisors', (err, results) => res.json(results || []));
});

app.get('/api/supervisor-allocations', (req, res) => {
  const sql = `
    SELECT sa.id, sa.exam_date, sa.session, b.name as block_name, s.name as supervisor_name
    FROM supervisor_allocation sa
    LEFT JOIN blocks1 b ON sa.block_id = b.id
    LEFT JOIN supervisors s ON sa.supervisor_id = s.id
    ORDER BY sa.id DESC
  `;
  db.query(sql, (err, results) => {
    if(err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

app.post('/api/allocate-supervisor', (req, res) => {
  const { exam_date, session, block_id, supervisor_id, reliever_id } = req.body;
  const sql = `INSERT INTO supervisor_allocation (exam_date, session, block_id, supervisor_id, reliever_id) VALUES (?, ?, ?, ?, ?)`;
  db.query(sql, [exam_date, session, block_id, supervisor_id, reliever_id], (err, result) => {
    if(err) return res.status(500).json({ error: err });
    res.json({ success: true, id: result.insertId });
  });
});

app.delete('/api/supervisor-allocations/:id', (req, res) => {
  db.query('DELETE FROM supervisor_allocation WHERE id=?', [req.params.id], (err) => res.json({ success: true }));
});

// ---------- SPECIAL CODES ----------
app.post('/api/assign-special-code', (req, res) => {
  const { exam_date, session, seat_no, subject_code, special_code, reason } = req.body;
  const sql = `INSERT INTO special_code_assignments (exam_date, session, seat_no, subject_code, special_code, reason) VALUES (?, ?, ?, ?, ?, ?)`;
  db.query(sql, [exam_date, session, seat_no, subject_code, special_code, reason], (err, result) => {
    if(err) return res.status(500).json({ error: err });
    res.json({ success: true });
  });
});


// ================= DATA ENTRY MODULE APIs =================

// --- 1. UPLOAD EXAM TIMETABLE ---
app.post('/api/upload-timetable', upload.single('file'), (req, res) => {
  if(!req.file) return res.status(400).json({ error: "No file uploaded" });

  const results = [];
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      // 1. Validation
      const errors = [];
      const values = [];
      results.forEach((row, index) => {
          // Headers: exam_date, day, session, time_slot, subject_code, subject_name, scheme
          if (!row.exam_date || !row.session || !row.subject_code || !row.scheme) {
              errors.push(`Row ${index + 2}: Missing required fields (Date, Session, Subject Code, or Scheme)`);
          } else {
              values.push([
                  row.exam_date, row.day || '', row.session, row.time_slot || '', row.subject_code, row.subject_name || '', row.scheme
              ]);
          }
      });

      if (errors.length > 0) {
          fs.unlinkSync(req.file.path);
          return res.status(400).json({ error: "Validation failed", details: errors });
      }

      if (values.length === 0) {
          fs.unlinkSync(req.file.path);
          return res.status(400).json({ error: "No valid data found in CSV" });
      }

      // 2. Transaction
      db.beginTransaction((err) => {
          if (err) {
              fs.unlinkSync(req.file.path);
              return res.status(500).json({ error: "Transaction error: " + err.message });
          }

          db.query("DELETE FROM exam_timetable", (err) => {
              if (err) {
                  return db.rollback(() => {
                      fs.unlinkSync(req.file.path);
                      res.status(500).json({ error: "Failed to clear old data: " + err.message });
                  });
              }

              const sql = "INSERT INTO exam_timetable (exam_date, day, session, time_slot, subject_code, subject_name, scheme) VALUES ?";
              db.query(sql, [values], (err) => {
                  if (err) {
                      return db.rollback(() => {
                          fs.unlinkSync(req.file.path);
                          res.status(500).json({ error: "Insert failed: " + err.message });
                      });
                  }

                  db.commit((err) => {
                      if (err) {
                          return db.rollback(() => {
                              fs.unlinkSync(req.file.path);
                              res.status(500).json({ error: "Commit failed: " + err.message });
                          });
                      }
                      fs.unlinkSync(req.file.path);
                      console.log(`[UPLOAD-TIMETABLE] Success: ${values.length} rows inserted.`);
                      res.json({ success: true, count: values.length, message: "Timetable updated successfully" });
                  });
              });
          });
      });
    });
});

app.get('/api/timetable', (req, res) => {
  db.query('SELECT * FROM exam_timetable ORDER BY exam_date DESC', (err, results) => {
    if(err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// --- 2. UPLOAD QUESTION PAPER INVENTORY ---
app.post('/api/upload-inventory', upload.single('file'), (req, res) => {
  if(!req.file) return res.status(400).json({ error: "No file uploaded" });

  const results = [];
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      // 1. Validation
      const errors = [];
      const values = [];
      results.forEach((row, index) => {
          if (!row.subject_code || !row.subject_name || !row.quantity) {
              errors.push(`Row ${index + 2}: Missing required fields`);
          } else if (isNaN(row.quantity)) {
              errors.push(`Row ${index + 2}: Quantity must be a number`);
          } else {
              values.push([row.subject_code, row.qp_code || '', row.subject_name, row.quantity]);
          }
      });

      if (errors.length > 0) {
          fs.unlinkSync(req.file.path);
          return res.status(400).json({ error: "Validation failed", details: errors });
      }

      if (values.length === 0) {
          fs.unlinkSync(req.file.path);
          return res.status(400).json({ error: "No valid data found in CSV" });
      }

      // 2. Transaction: Delete then Insert
      db.beginTransaction((err) => {
          if (err) {
              fs.unlinkSync(req.file.path);
              return res.status(500).json({ error: "Transaction error: " + err.message });
          }

          db.query("DELETE FROM paper_inventory", (err) => {
              if (err) {
                  return db.rollback(() => {
                      fs.unlinkSync(req.file.path);
                      res.status(500).json({ error: "Delete failed: " + err.message });
                  });
              }

              const sql = "INSERT INTO paper_inventory (subject_code, qp_code, subject_name, quantity) VALUES ?";
              db.query(sql, [values], (err) => {
                  if (err) {
                      return db.rollback(() => {
                          fs.unlinkSync(req.file.path);
                          res.status(500).json({ error: "Insert failed: " + err.message });
                      });
                  }

                  db.commit((err) => {
                      if (err) {
                          return db.rollback(() => {
                              fs.unlinkSync(req.file.path);
                              res.status(500).json({ error: "Commit failed: " + err.message });
                          });
                      }
                      fs.unlinkSync(req.file.path);
                      console.log(`[UPLOAD-INVENTORY] Success: ${values.length} rows inserted.`);
                      res.json({ success: true, count: values.length, message: "Inventory updated successfully" });
                  });
              });
          });
      });
    });
});

app.get('/api/inventory', (req, res) => {
  db.query('SELECT * FROM paper_inventory', (err, results) => {
    if(err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// --- 3. UPLOAD SEATING ARRANGEMENT ---
app.post('/api/upload-seating', upload.single('file'), (req, res) => {
  if(!req.file) return res.status(400).json({ error: "No file uploaded" });

  const results = [];
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      // 1. Validation
      const errors = [];
      const values = [];
      results.forEach((row, index) => {
        // Headers: sr_no, seat_no, course, subject_code, institute_code
        if (!row.seat_no || !row.subject_code || !row.institute_code) {
             errors.push(`Row ${index + 2}: Missing required fields (Seat No, Subject Code, or Institute Code)`);
        } else {
             values.push([row.sr_no || (index + 1), row.seat_no, row.course || '', row.subject_code, row.institute_code]);
        }
      });

      if (errors.length > 0) {
          fs.unlinkSync(req.file.path);
          return res.status(400).json({ error: "Validation failed", details: errors });
      }

      if (values.length === 0) {
          fs.unlinkSync(req.file.path);
          return res.status(400).json({ error: "No valid data found in CSV" });
      }

      // 2. Transaction
      db.beginTransaction((err) => {
          if (err) {
              fs.unlinkSync(req.file.path);
              return res.status(500).json({ error: "Transaction error: " + err.message });
          }

          db.query("DELETE FROM seating_chart", (err) => {
              if (err) {
                  return db.rollback(() => {
                      fs.unlinkSync(req.file.path);
                      res.status(500).json({ error: "Delete failed: " + err.message });
                  });
              }

              const sql = "INSERT INTO seating_chart (sr_no, seat_no, course, subject_code, institute_code) VALUES ?";
              db.query(sql, [values], (err) => {
                  if (err) {
                      return db.rollback(() => {
                          fs.unlinkSync(req.file.path);
                          res.status(500).json({ error: "Insert failed: " + err.message });
                      });
                  }

                  db.commit((err) => {
                      if (err) {
                          return db.rollback(() => {
                              fs.unlinkSync(req.file.path);
                              res.status(500).json({ error: "Commit failed: " + err.message });
                          });
                      }
                      fs.unlinkSync(req.file.path);
                      console.log(`[UPLOAD-SEATING] Success: ${values.length} rows inserted.`);
                      res.json({ success: true, count: values.length, message: "Seating chart updated successfully" });
                  });
              });
          });
      });
    });
});

app.get('/api/seating-chart', (req, res) => {
  db.query('SELECT * FROM seating_chart LIMIT 100', (err, results) => {
    if(err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// --- 4. UPLOAD MARKSHEET DATA ---
app.post('/api/upload-marksheet', upload.single('file'), (req, res) => {
  if(!req.file) return res.status(400).json({ error: "No file uploaded" });

  const results = [];
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      // 1. Validation
      const errors = [];
      const values = [];
      results.forEach((row, index) => {
          // Headers: marksheet_no, subject_abb, course, subject_code, institute_code
          if (!row.marksheet_no || !row.subject_code || !row.institute_code) {
              errors.push(`Row ${index + 2}: Missing required fields (Marksheet No, Subject Code, or Institute Code)`);
          } else {
              values.push([row.marksheet_no, row.subject_abb || '', row.course || '', row.subject_code, row.institute_code]);
          }
      });

      if (errors.length > 0) {
          fs.unlinkSync(req.file.path);
          return res.status(400).json({ error: "Validation failed", details: errors });
      }

      if (values.length === 0) {
          fs.unlinkSync(req.file.path);
          return res.status(400).json({ error: "No valid data found in CSV" });
      }

      // 2. Transaction
      db.beginTransaction((err) => {
          if (err) {
              fs.unlinkSync(req.file.path);
              return res.status(500).json({ error: "Transaction error: " + err.message });
          }

          db.query("DELETE FROM marksheet", (err) => {
              if (err) {
                  return db.rollback(() => {
                      fs.unlinkSync(req.file.path);
                      res.status(500).json({ error: "Delete failed: " + err.message });
                  });
              }

              const sql = "INSERT INTO marksheet (marksheet_no, subject_abb, course, subject_code, institute_code) VALUES ?";
              db.query(sql, [values], (err) => {
                  if (err) {
                      return db.rollback(() => {
                          fs.unlinkSync(req.file.path);
                          res.status(500).json({ error: "Insert failed: " + err.message });
                      });
                  }

                  db.commit((err) => {
                      if (err) {
                          return db.rollback(() => {
                              fs.unlinkSync(req.file.path);
                              res.status(500).json({ error: "Commit failed: " + err.message });
                          });
                      }
                      fs.unlinkSync(req.file.path);
                      console.log(`[UPLOAD-MARKSHEET] Success: ${values.length} rows inserted.`);
                      res.json({ success: true, count: values.length, message: "Marksheet data updated successfully" });
                  });
              });
          });
      });
    });
});

app.get('/api/marksheet', (req, res) => {
  db.query('SELECT * FROM marksheet LIMIT 100', (err, results) => {
    if(err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// --- 5. EXTRA/LESS PAPER ENTRY ---
app.get('/api/extra-paper', (req, res) => {
  db.query('SELECT * FROM extra_paper', (err, results) => {
    if(err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

app.post('/api/extra-paper', (req, res) => {
  const { date, session, subject_code, extra, less, reason } = req.body;
  const sql = "INSERT INTO extra_paper (date, session, subject_code, extra, less, reason) VALUES (?, ?, ?, ?, ?, ?)";
  db.query(sql, [date, session, subject_code, extra, less, reason], (err) => {
    if(err) return res.status(500).json({ error: err });
    res.json({ success: true });
  });
});

app.delete('/api/extra-paper/:id', (req, res) => {
  db.query('DELETE FROM extra_paper WHERE id=?', [req.params.id], (err) => {
    if(err) return res.status(500).json({ error: err });
    res.json({ success: true });
  });
});

// --- 6. DETAINED STUDENTS ---
app.get('/api/detained', (req, res) => {
  db.query('SELECT * FROM detained_students', (err, results) => res.json(results));
});

app.post('/api/detained', (req, res) => {
  const { seat_no, subject_code, reason } = req.body;
  const sql = "INSERT INTO detained_students (seat_no, subject_code, reason) VALUES (?, ?, ?)";
  db.query(sql, [seat_no, subject_code, reason], (err) => {
    if(err) return res.status(500).json({ error: err });
    res.json({ success: true });
  });
});

app.delete('/api/detained/:id', (req, res) => {
  db.query('DELETE FROM detained_students WHERE id=?', [req.params.id], (err) => {
    if(err) return res.status(500).json({ error: err });
    res.json({ success: true });
  });
});

// --- 7. SUBJECT CODES (Sections) ---
app.get('/api/subject-codes', (req, res) => {
  db.query('SELECT * FROM subject_sections', (err, results) => res.json(results));
});

app.post('/api/subject-codes', (req, res) => {
  const { subject_code, section, subject_name } = req.body;
  const sql = "INSERT INTO subject_sections (subject_code, section, subject_name) VALUES (?, ?, ?)";
  db.query(sql, [subject_code, section, subject_name], (err) => {
    if(err) return res.status(500).json({ error: err });
    res.json({ success: true });
  });
});

app.delete('/api/subject-codes/:id', (req, res) => {
  db.query('DELETE FROM subject_sections WHERE id=?', [req.params.id], (err) => {
    if(err) return res.status(500).json({ error: err });
    res.json({ success: true });
  });
});

// --- 8. STUDENT COUNT REPORT (Verification) ---
app.get('/api/student-count-report', (req, res) => {
  // Query to compare Seating Chart count vs Inventory count per subject
  const sql = `
    SELECT 
      pi.subject_code,
      pi.subject_name,
      pi.quantity as msbte_count,
      COUNT(sc.seat_no) as seating_count,
      (pi.quantity - COUNT(sc.seat_no)) as difference,
      CASE 
        WHEN pi.quantity = COUNT(sc.seat_no) THEN 'Matched'
        ELSE 'Mismatch'
      END as status
    FROM paper_inventory pi
    LEFT JOIN seating_chart sc ON pi.subject_code = sc.subject_code
    GROUP BY pi.subject_code, pi.subject_name, pi.quantity
  `;
  db.query(sql, (err, results) => {
    if(err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// ================= STUDENT PORTAL APIs =================

// 1. Get Student Personal Info & Seating
app.get('/api/student/info', (req, res) => {
  const { enrollment_no } = req.query;
  
  if (!enrollment_no) return res.status(400).json({ error: 'Enrollment No required' });

  // 1. Get Student Details
  db.query('SELECT * FROM students WHERE enrollment_no = ?', [enrollment_no], (err, studentRes) => {
    if(err) return res.status(500).json({ error: err });
    if(studentRes.length === 0) return res.status(404).json({ error: 'Student not found' });

    const student = studentRes[0];
    
    // 2. Get Seating Details (Block, Room, etc.)
    // Logic: Join seating_chart with block_allocation or blocks1
    // Assuming 'seat_no' links to 'seating_chart', and 'block_allocation' defines the block for that seat range
    
    // Simplified logic: Fetch Block info directly if available or simulate
    // Real implementation would require complex JOINs based on seat number ranges in block_allocation
    
    // For now, let's try to find a block where this student's seat falls in range
    const sql = `
      SELECT 
        b.name as block_name, 
        b.location as room_no,
        ba.subject_name
      FROM block_allocation ba
      JOIN blocks1 b ON ba.block_id = b.id
      WHERE ? BETWEEN ba.start_seat_no AND ba.end_seat_no
      AND ba.exam_date >= CURDATE()
      ORDER BY ba.exam_date ASC
      LIMIT 1
    `;

    db.query(sql, [student.seat_no], (err2, blockRes) => {
       // Even if error or no block found, return student info
       const blockInfo = blockRes && blockRes.length > 0 ? blockRes[0] : {};
       
       res.json({
         full_name: student.full_name,
         seat_no: student.seat_no,
         enrollment_no: student.enrollment_no,
         scheme: student.scheme,
         block_no: blockInfo.block_name || 'Not Allocated',
         floor_no: 'Ground', // Default or fetch from blocks table if column exists
         classroom_no: blockInfo.room_no || 'N/A',
         bench_no: student.seat_no // Usually seat no is bench no
       });
    });
  });
});

// 2. Get Student Timetable (Today Only)
app.get('/api/student/timetable', (req, res) => {
  const { enrollment_no } = req.query;

  if (!enrollment_no) return res.status(400).json({ error: 'Enrollment No required' });

  // Get student scheme first
  db.query('SELECT scheme FROM students WHERE enrollment_no = ?', [enrollment_no], (err, sRes) => {
    if(err || sRes.length===0) return res.status(404).json({ error: 'Student not found' });
    
    const scheme = sRes[0].scheme;

    // Fetch Upcoming Exams
    const sql = `
      SELECT 
        DATE_FORMAT(exam_date, '%Y-%m-%d') as exam_date,
        session,
        subject_name,
        subject_code,
        time_slot
      FROM exam_timetable 
      WHERE scheme = ? 
      AND exam_date >= CURDATE()
      ORDER BY exam_date ASC
    `;

    db.query(sql, [scheme], (err2, timetable) => {
      if(err2) return res.status(500).json({ error: err2 });
      res.json(timetable);
    });
  });
});

// ================= REPORTS API =================
// Gate Chart Report
app.post('/api/report/gate-chart', (req, res) => {
  const { date, session, blockId } = req.body;
  if (!date || !session || !blockId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const sql = `
    SELECT 
      ba.institute_code,
      ba.course,
      ba.subject_code,
      ba.subject_name,
      ba.start_seat_no,
      ba.end_seat_no,
      ba.total_students,
      b.name as block_name
    FROM block_allocation ba
    JOIN blocks1 b ON ba.block_id = b.id
    WHERE ba.exam_date = ? 
    AND ba.session = ? 
    AND ba.block_id = ?
  `;

  db.query(sql, [date, session, blockId], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// Attendance Report (Generic)
app.post('/api/report/attendance', (req, res) => {
  const { date, session, blockId } = req.body;
  
  // This is a placeholder logic for attendance
  // You might want to join with an 'absent_records' table if you have one
  const sql = `
    SELECT * FROM block_allocation 
    WHERE exam_date = ? AND session = ? AND block_id = ?
  `;
  db.query(sql, [date, session, blockId], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// --- CHANGE PASSWORD ---
app.post('/api/change-password-dataentry', async (req, res) => {
  const { username, currentPassword, newPassword } = req.body;
  if(!username || !currentPassword || !newPassword) return res.status(400).json({ error: "Missing fields" });

  db.query('SELECT * FROM data_entries WHERE username=?', [username], async (err, results) => {
    if(err) return res.status(500).json({ error: err });
    if(results.length === 0) return res.status(404).json({ error: "User not found" });

    const user = results[0];
    const match = await bcrypt.compare(currentPassword, user.password_hash);
    if(!match) return res.status(401).json({ error: "Incorrect current password" });

    const newHash = await bcrypt.hash(newPassword, 10);
    db.query('UPDATE data_entries SET password_hash=? WHERE id=?', [newHash, user.id], (err2) => {
      if(err2) return res.status(500).json({ error: err2 });
      res.json({ success: true });
    });
  });
});

app.post('/api/change-password', async (req, res) => {
  const adminId = 1; // or get from session/auth token
  const { currentPassword, newPassword } = req.body;

  // Get current hashed password from DB
  db.query('SELECT password_hash FROM admins WHERE id = ?', [adminId], async (err, results) => {
    if(err) return res.status(500).json({ success:false, message: 'Database error' });
    if(results.length === 0) return res.status(404).json({ success:false, message:'Admin not found' });

    const hashedPass = results[0].password_hash;
    const match = await bcrypt.compare(currentPassword, hashedPass);

    if(!match) return res.status(400).json({ success:false, message:'Current password is incorrect' });

    const newHash = await bcrypt.hash(newPassword, 10);

    db.query('UPDATE admins SET password_hash = ? WHERE id = ?', [newHash, adminId], (err2) => {
      if(err2) return res.status(500).json({ success:false, message:'Failed to update password' });
      res.json({ success:true, message:'Password updated successfully ✅' });
    });
  });
});

// ================= REPORT: SUPERVISOR ALLOCATION =================
app.get("/api/report/supervisor-allocation", (req, res) => {
    const { date, session } = req.query;
    // Handle Morning/Morning Session mismatch
    const sessionSearch = `%${session}%`;

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
        
        -- Improved WHERE clause
        WHERE CAST(sa.exam_date AS CHAR) = ? AND sa.session LIKE ?
    `;

    db.query(sql, [date, sessionSearch], (err, rows) => {
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
        WHERE CAST(et.exam_date AS CHAR) = ?
        ORDER BY et.session ASC, et.subject_code ASC
    `;
    const settingsSql = "SELECT setting_key, setting_value FROM system_settings";
    db.query(sql, [date], (err, rows) => {
        if (err) return res.status(500).json({ error: "Database error", details: err.sqlMessage });
        db.query(settingsSql, (err2, settingRows) => {
            if (err2) return res.status(500).json(err2);
            const settings = {};
            settingRows.forEach(r => settings[r.setting_key] = r.setting_value);
            res.json({ reportData: rows, settings });
        });
    });
});

// ================= REPORT: GATE CHART =================
app.get("/api/report/gate-chart", (req, res) => {
    const { date, session } = req.query;
    
    // Robust Session Matching: If "Morning Session" is passed, match "Morning" or "Morning Session"
    let sessionSearch = session;
    if (session && session.toLowerCase().includes('morning')) {
        sessionSearch = '%Morning%';
    } else if (session && session.toLowerCase().includes('afternoon')) {
        sessionSearch = '%Afternoon%';
    } else {
        sessionSearch = `%${session}%`;
    }

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
    const settingsSql = "SELECT setting_key, setting_value FROM system_settings";

    db.query(sql, [date, sessionSearch], (err, rows) => {
        if (err) return res.status(500).json({ error: "Database error" });
        
        // Fetch Settings
        db.query(settingsSql, (err2, settingRows) => {
             // If settings table missing or error, return defaults implicitly by sending empty settings obj
             const settings = {};
             if(!err2 && settingRows) {
                settingRows.forEach(r => settings[r.setting_key] = r.setting_value);
             }
             res.json({ reportData: rows, settings });
        });
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
        if (err) return res.status(500).json({ error: "Database error" });
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
            CASE WHEN pi.quantity > 0 THEN 1 ELSE 0 END AS total_bundles
        FROM exam_timetable et
        LEFT JOIN paper_inventory pi ON et.subject_code = pi.subject_code
        WHERE et.exam_date = ?
    `;
    db.query(sql, [date], (err, rows) => {
        if (err) return res.status(500).json({ error: "Database error" });
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
        const grouped = rows.reduce((acc, row) => {
            if (!acc[row.session]) acc[row.session] = { codes: [], counts: [] };
            acc[row.session].codes.push(row.subject_code);
            acc[row.session].counts.push(row.total_packets);
            return acc;
        }, {});
        res.json(grouped);
    });
});

// ================= REPORT: PANCHANAMA (Format 22) =================
app.get("/api/report/panchanama", (req, res) => {
    const { date, session } = req.query;
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

// ================= REPORT: BLANK PRESENT/ABSENT =================
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

// ================= API: Format-07 =================
app.get("/api/report/format-07", (req, res) => {
    const { date, session } = req.query;
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
        if (err) return res.status(500).json({ success: false, error: err.message });
        res.json(rows);
    });
});

// ================= API: Format-08 =================
app.get("/api/report/format-08", (req, res) => {
    const { date, session } = req.query;
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
        if (err) return res.status(500).json({ success: false, error: err.message });
        res.json(rows);
    });
});

// ================= API: QP Record =================
app.get("/api/report/question-paper-record", (req, res) => {
    const { date } = req.query;
    const sql = `
        SELECT 
            et.scheme, 
            et.subject_name AS subject_abbreviation, 
            et.subject_code AS question_paper_code,
            COALESCE(pi.quantity, 0) AS received,
            0 AS used,
            0 AS rac
        FROM exam_timetable et
        LEFT JOIN paper_inventory pi ON et.subject_code = pi.subject_code
        WHERE et.exam_date = ?
    `;
    db.query(sql, [date], (err, rows) => {
        if (err) return res.status(500).json({ success: false, error: err.message });
        res.json(rows);
    });
});

// ================= REPORT: BATCH ARRANGEMENT (Block Summary) =================
app.get("/api/report/block-summary", (req, res) => {
    const { date, session } = req.query;
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

// ================= API: BENCH ARRANGEMENT (For Printing) =================
app.get("/api/bench_arrangement", (req, res) => {
    const { block, date, session } = req.query;

    const sql = `
        SELECT 
            b.name AS block_name,
            b.location AS room_no,
            ba.institute_code,
            ba.course,
            ba.subject_name,
            ba.subject_code,
            ba.start_seat_no,
            ba.end_seat_no
        FROM block_allocation ba
        JOIN blocks1 b ON ba.block_id = b.id
        WHERE b.name = ? AND ba.exam_date = ? AND ba.session = ?
    `;

    db.query(sql, [block, date, session], (err, rows) => {
        if (err) return res.status(500).json({ error: "Database error" });
        if (rows.length === 0) return res.status(404).json({ error: "Block allocation not found" });

        const data = rows[0];

        // Generate Seat List
        const seats = [];
        const start = parseInt(data.start_seat_no);
        const end = parseInt(data.end_seat_no);
        let benchCount = 1;

        if (!isNaN(start) && !isNaN(end)) {
            for (let i = start; i <= end; i++) {
                seats.push({
                    bench: `B-${benchCount++}`,
                    seat: i
                });
            }
        }

        res.json({
            header: {
                exam_center: "Government Polytechnic, Arvi", // Ideally from settings
                center_code: "1636", // Ideally from settings
                date: date,
                session: session,
                block_no: data.block_name,
                room_no: data.room_no,
                courses: `${data.course} - ${data.subject_name} (${data.subject_code})`
            },
            seats: seats
        });
    });
});

// ================= SPECIAL CODE ASSIGNMENT API =================
app.get("/api/special-code-candidates", (req, res) => {
    const { date, session } = req.query;
    const sessionSearch = `%${session}%`;
    const sql = `
        SELECT 
            sc.seat_no,
            st.full_name AS student_name,
            sc.institute_code,
            sc.subject_code,
            COALESCE(sca.special_code, 'Present') as current_status
        FROM seating_chart sc
        JOIN exam_timetable et ON sc.subject_code = et.subject_code
        LEFT JOIN students st ON sc.seat_no = st.seat_no
        LEFT JOIN special_code_assignments sca ON (
            sc.seat_no = sca.seat_no AND 
            sc.subject_code = sca.subject_code
        )
        WHERE CAST(et.exam_date AS CHAR) = ? AND et.session_type LIKE ?
        ORDER BY sc.seat_no ASC
    `;
    db.query(sql, [date, sessionSearch], (err, rows) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json(rows);
    });
});

// 2. ASSIGN CODE (Save to DB)
app.post("/api/assign-special-code", (req, res) => {
    const { date, session, seat_no, subject_code, special_code } = req.body;
    const sql = `
        INSERT INTO special_code_assignments (exam_date, session, seat_no, subject_code, special_code)
        VALUES (?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE special_code = VALUES(special_code)
    `;
    db.query(sql, [date, session, seat_no, subject_code, special_code], (err, result) => {
        if (err) return res.status(500).json({ error: "Database error" });
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



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
// const express = require('express');
// const mysql = require('mysql2');
// const cors = require('cors');
// const bcrypt = require('bcrypt');

// const app = express();
// const PORT = 3000;

// // ------------------- Middleware -------------------
// app.use(cors());
// app.use(express.json()); // for parsing application/json

// // ------------------- MySQL Connection -------------------
// const db = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',       
//   password: 'manager',
//   database: 'attendance_system'
// });

// db.connect(err => {
//   if(err){ 
//     console.error('DB connection error:', err); 
//     return; 
//   }
//   console.log('Connected to MySQL!');
// });

// // ------------------- OFFICERS -------------------
// app.get('/api/officers', (req, res) => {
//   db.query('SELECT * FROM officers ORDER BY id DESC', (err, results) => {
//     if(err) return res.status(500).json({ error: err });
//     res.json(results);
//   });
// });

// app.get('/api/officers/:id', (req, res) => {
//   db.query('SELECT * FROM officers WHERE id=?', [req.params.id], (err, results) => {
//     if(err) return res.status(500).json({ error: err });
//     res.json(results[0]);
//   });
// });

// app.post('/api/officers', async (req, res) => {
//   const { username, password } = req.body;
//   if(!username || !password) return res.status(400).json({ error: 'Username and Password required' });

//   const hash = await bcrypt.hash(password, 10);

//   db.query('INSERT INTO officers (username, password) VALUES (?, ?)', [username, hash], (err, result) => {
//     if(err) return res.status(500).json({ error: err });
//     res.json({ success: true, id: result.insertId });
//   });
// });

// app.put('/api/officers/:id', async (req, res) => {
//   const { username, password } = req.body;
//   const hash = await bcrypt.hash(password, 10);

//   db.query('UPDATE officers SET username=?, password=? WHERE id=?', [username, hash, req.params.id], (err) => {
//     if(err) return res.status(500).json({ error: err });
//     res.json({ success: true });
//   });
// });

// app.delete('/api/officers/:id', (req, res) => {
//   db.query('DELETE FROM officers WHERE id=?', [req.params.id], (err) => {
//     if(err) return res.status(500).json({ error: err });
//     res.json({ success: true });
//   });
// });

// // ------------------- LOGIN -------------------
// app.post('/api/login', (req, res) => {
//   const { username, password, role } = req.body;
//   if(!username || !password) return res.json({ success:false, message:'Missing credentials' });

//   db.query('SELECT * FROM admins WHERE username=?', [username], async (err, results) => {
//     if(err) return res.json({ success:false, message:'Database error' });
//     if(results.length === 0) return res.json({ success:false, message:'User not found' });

//     const user = results[0];
//     const match = await bcrypt.compare(password, user.password_hash);
//     if(!match) return res.json({ success:false, message:'Wrong password' });

//     res.json({ success:true, role });
//   });
// });

// // ------------------- DATA ENTRIES -------------------
// app.get('/api/data', (req, res) => {
//   db.query('SELECT * FROM data_entries ORDER BY id DESC', (err, results) => {
//     if(err) return res.status(500).json({ error: err });
//     res.json(results);
//   });
// });

// app.get('/api/data/:id', (req, res) => {
//   db.query('SELECT * FROM data_entries WHERE id=?', [req.params.id], (err, results) => {
//     if(err) return res.status(500).json({ error: err });
//     res.json(results[0]);
//   });
// });

// app.post('/api/data', async (req, res) => {
//   const { username, password } = req.body;
//   if(!username || !password) return res.status(400).json({ error: 'Username and Password required' });

//   const hash = await bcrypt.hash(password, 10);

//   db.query('INSERT INTO data_entries (username, password) VALUES (?, ?)', [username, hash], (err, result) => {
//     if(err) return res.status(500).json({ error: err });
//     res.json({ success: true, id: result.insertId });
//   });
// });

// app.put('/api/data/:id', async (req, res) => {
//   const { username, password } = req.body;
//   const hash = await bcrypt.hash(password, 10);

//   db.query('UPDATE data_entries SET username=?, password=? WHERE id=?', [username, hash, req.params.id], (err) => {
//     if(err) return res.status(500).json({ error: err });
//     res.json({ success: true });
//   });
// });

// app.delete('/api/data/:id', (req, res) => {
//   db.query('DELETE FROM data_entries WHERE id=?', [req.params.id], (err) => {
//     if(err) return res.status(500).json({ error: err });
//     res.json({ success: true });
//   });
// });

// // ------------------- INSTITUTES -------------------
// app.get('/api/institutes', (req, res) => {
//   db.query('SELECT * FROM institutes ORDER BY id DESC', (err, results) => {
//     if(err) return res.status(500).json({ error: err });
//     res.json(results);
//   });
// });

// app.get('/api/institutes/:id', (req, res) => {
//   db.query('SELECT * FROM institutes WHERE id=?', [req.params.id], (err, results) => {
//     if(err) return res.status(500).json({ error: err });
//     res.json(results[0]);
//   });
// });

// app.post('/api/institutes', (req, res) => {
//   const { code, name, address } = req.body;
//   if(!code || !name) return res.status(400).json({ success:false, message:'Code and Name required' });

//   db.query('INSERT INTO institutes (code, name, address) VALUES (?,?,?)', [code, name, address], (err, result) => {
//     if(err) return res.status(500).json({ success:false, error: err });
//     res.json({ success:true, id: result.insertId });
//   });
// });

// app.put('/api/institutes/:id', (req, res) => {
//   const { code, name, address } = req.body;
//   db.query('UPDATE institutes SET code=?, name=?, address=? WHERE id=?', [code, name, address, req.params.id], (err) => {
//     if(err) return res.status(500).json({ error: err });
//     res.json({ success:true });
//   });
// });

// app.delete('/api/institutes/:id', (req, res) => {
//   db.query('DELETE FROM institutes WHERE id=?', [req.params.id], (err) => {
//     if(err) return res.status(500).json({ error: err });
//     res.json({ success:true });
//   });
// });

// // ------------------- START SERVER -------------------
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

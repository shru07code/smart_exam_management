// -------------------- DB.JS --------------------
const mysql = require('mysql95');

// Create a connection pool for better performance
const db = mysql.createPool({
    host: 'localhost',       // Your MySQL host
    user: 'root',            // Your MySQL username
    password: 'KARTmysql@18',            // Your MySQL password
    database: 'attendance_system', // Your database name (replace if different)
    connectionLimit: 10      // Max simultaneous connections
});

// Test the connection
db.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to MySQL:', err.message);
    } else {
        console.log('Connected to MySQL database!');
        connection.release(); // release connection back to pool
    }
});

module.exports = db;

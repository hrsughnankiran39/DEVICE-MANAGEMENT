const mysql = require('mysql2');

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Sughnan7#@',
    database: 'devicesdb'
});

// Establish connection
db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err.message);
        process.exit(1); // Exit the process if the connection fails
    }
    console.log("Connected to MySQL database.");
});

// Create the devices table if it does not exist
const createDevicesTableQuery = `
CREATE TABLE IF NOT EXISTS devices (
    device_id VARCHAR(50) PRIMARY KEY,
    created_by VARCHAR(50) NOT NULL,
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    soft_delete BOOLEAN DEFAULT FALSE
)`;


db.query(createDevicesTableQuery, (err, results) => {
    if (err) {
        console.error('Error creating devices table:', err.message);
    } else {
        console.log("Devices table ensured in database.");
    }
});

// Create the users table if it does not exist
const createUsersTableQuery = `
CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`;

db.query(createUsersTableQuery, (err, results) => {
    if (err) {
        console.error('Error creating users table:', err.message);
    } else {
        console.log("Users table ensured in database.");
    }
});

// Export database connection
module.exports = db;

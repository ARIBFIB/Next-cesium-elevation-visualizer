const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const authRoutes = require('./routes/auth');
const elevationRoutes = require('./routes/elevation');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize SQLite database
const db = new sqlite3.Database('./database/sqlite.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the SQLite database.');
});

// Create tables if they don't exist
db.serialize(() => {
  // Users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Elevation comparisons table
  db.run(`CREATE TABLE IF NOT EXISTS elevation_comparisons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    reference_point TEXT NOT NULL,
    surrounding_points TEXT NOT NULL,
    elevations TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`);

  // Insert a test user
  const bcrypt = require('bcryptjs');
  const hashedPassword = bcrypt.hashSync('abdul', 10);
  db.run(`INSERT OR IGNORE INTO users (email, password) VALUES (?, ?)`, 
    ['abdulrehman@gmail.com', hashedPassword]);
});

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/elevation', elevationRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
const { db } = require('../config/db')

// Create users table if it doesn't exist
const createUsersTable = async () => {
  try {
    db.serialize(() => {
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `)
      console.log('Users table created or already exists')
    })
  } catch (error) {
    console.error('Error creating users table:', error)
  }
}

// Initialize the table
createUsersTable()

module.exports = {
  createUsersTable,
}
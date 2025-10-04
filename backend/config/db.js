const sqlite3 = require('sqlite3').verbose()
const path = require('path')

// Create database file in the backend directory
const dbPath = path.join(__dirname, '..', 'database.sqlite')

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message)
  } else {
    console.log('Connected to SQLite database')
  }
})

// Helper function to run queries
const query = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err)
      } else {
        resolve({ rows })
      }
    })
  })
}

// Helper function for insert operations
const run = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) {
        reject(err)
      } else {
        resolve({ 
          rows: [{ id: this.lastID, ...params }] 
        })
      }
    })
  })
}

module.exports = {
  query,
  run,
  db // Export the db instance for table creation
}
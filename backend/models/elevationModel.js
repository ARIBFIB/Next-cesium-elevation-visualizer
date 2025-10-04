const { db } = require('../config/db')

// Create elevation_data table if it doesn't exist
const createElevationDataTable = async () => {
  try {
    db.serialize(() => {
      db.run(`
        CREATE TABLE IF NOT EXISTS elevation_data (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          reference_point TEXT NOT NULL,
          surrounding_points TEXT NOT NULL,
          distance REAL NOT NULL,
          timestamp TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
        )
      `)
      console.log('Elevation data table created or already exists')
    })
  } catch (error) {
    console.error('Error creating elevation data table:', error)
  }
}

// Initialize the table
createElevationDataTable()

module.exports = {
  createElevationDataTable,
}
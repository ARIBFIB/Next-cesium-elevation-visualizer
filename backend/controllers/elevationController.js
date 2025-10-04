const { query, run } = require('../config/db')

// Save elevation data
const saveElevationData = async (req, res) => {
  try {
    const userId = req.user.id
    const { referencePoint, surroundingPoints, distance, timestamp } = req.body

    // Insert elevation data
    const result = await run(
      `INSERT INTO elevation_data 
      (user_id, reference_point, surrounding_points, distance, timestamp) 
      VALUES (?, ?, ?, ?, ?)`,
      [
        userId,
        JSON.stringify(referencePoint),
        JSON.stringify(surroundingPoints),
        distance,
        timestamp,
      ]
    )

    res.status(201).json(result.rows[0])
  } catch (error) {
    console.error('Save elevation data error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// Get user's elevation data
const getElevationData = async (req, res) => {
  try {
    const userId = req.user.id

    // Get elevation data
    const result = await query(
      'SELECT * FROM elevation_data WHERE user_id = ? ORDER BY timestamp DESC',
      [userId]
    )

    res.json(result.rows)
  } catch (error) {
    console.error('Get elevation data error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

module.exports = {
  saveElevationData,
  getElevationData,
}
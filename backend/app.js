const express = require('express')
const cors = require('cors')
const authRoutes = require('./routes/authRoutes')
const elevationRoutes = require('./routes/elevationRoutes')
const db = require('./config/db')

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/elevation', elevationRoutes)

// Default route
app.get('/', (req, res) => {
  res.send('Cesium Elevation Analysis API')
})

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
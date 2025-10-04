const express = require('express')
const router = express.Router()
const auth = require('../middleware/authMiddleware')
const { saveElevationData, getElevationData } = require('../controllers/elevationController')

router.post('/save', auth, saveElevationData)

router.get('/data', auth, getElevationData)

module.exports = router
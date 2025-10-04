const express = require('express');
const ElevationComparison = require('../models/ElevationComparison');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Get elevation for a point
router.post('/get-elevation', authMiddleware, async (req, res) => {
  try {
    const { longitude, latitude } = req.body;
    
    // In a real application, you would use a service like Cesium ion or other elevation API
    // For this example, we'll simulate elevation data
    const elevation = Math.random() * 1000 + 100; // Random elevation between 100-1100 meters
    
    res.json({ longitude, latitude, elevation });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Compare elevations within a buffer
router.post('/compare', authMiddleware, async (req, res) => {
  try {
    const { longitude, latitude, distance } = req.body;
    const userId = req.user.id;
    
    // Get elevation for the reference point
    const referenceElevation = Math.random() * 1000 + 100;
    
    // Generate random points within the buffer
    const surroundingPoints = [];
    const lowerElevationPoints = [];
    
    // In a real application, you would calculate actual points within the buffer
    // For this example, we'll generate random points
    for (let i = 0; i < 10; i++) {
      const pointLongitude = longitude + (Math.random() - 0.5) * 0.1;
      const pointLatitude = latitude + (Math.random() - 0.5) * 0.1;
      const pointElevation = Math.random() * 1000 + 100;
      
      surroundingPoints.push({
        longitude: pointLongitude,
        latitude: pointLatitude,
        elevation: pointElevation
      });
      
      if (pointElevation < referenceElevation) {
        lowerElevationPoints.push({
          longitude: pointLongitude,
          latitude: pointLatitude,
          elevation: pointElevation
        });
      }
    }
    
    // Store the comparison result
    await ElevationComparison.create(
      userId,
      { longitude, latitude, elevation: referenceElevation },
      surroundingPoints,
      { reference: referenceElevation, lower: lowerElevationPoints }
    );
    
    res.json({
      referencePoint: { longitude, latitude, elevation: referenceElevation },
      surroundingPoints,
      lowerElevationPoints
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's elevation comparisons
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const comparisons = await ElevationComparison.findByUserId(userId);
    
    res.json(comparisons);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
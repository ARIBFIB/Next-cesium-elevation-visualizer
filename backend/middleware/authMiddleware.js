const jwt = require('jsonwebtoken')
const { JWT_SECRET } = process.env

const auth = (req, res, next) => {
  // Get token from header
  const token = req.header('Authorization')?.replace('Bearer ', '')

  // Check if not token
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' })
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET)

    // Add user from payload
    req.user = decoded
    next()
  } catch (error) {
    console.error('Auth middleware error:', error)
    res.status(401).json({ message: 'Token is not valid' })
  }
}

module.exports = auth
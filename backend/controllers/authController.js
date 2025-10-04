const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { query, run } = require('../config/db')
const { JWT_SECRET } = process.env

// Register a new user
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body

    // Check if user already exists
    const userExists = await query('SELECT * FROM users WHERE email = ?', [email])
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' })
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create user
    const result = await run(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    )

    const user = result.rows[0]

    // Create JWT token
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1d' })

    res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    })
  } catch (error) {
    console.error('Register error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Check if user exists
    const result = await query('SELECT * FROM users WHERE email = ?', [email])
    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    const user = result.rows[0]

    // Check password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    // Create JWT token
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1d' })

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// Verify token
const verify = async (req, res) => {
  try {
    const userId = req.user.id

    // Get user info
    const result = await query('SELECT id, name, email FROM users WHERE id = ?', [userId])
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json({ user: result.rows[0] })
  } catch (error) {
    console.error('Verify error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// Logout user
const logout = async (req, res) => {
  try {
    // In a real application, you might want to invalidate the token
    // For now, we'll just return a success message
    res.json({ message: 'Logged out successfully' })
  } catch (error) {
    console.error('Logout error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

module.exports = {
  register,
  login,
  verify,
  logout,
}
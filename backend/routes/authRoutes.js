const express = require('express')
const router = express.Router()
const auth = require('../middleware/authMiddleware')
const { register, login, verify, logout } = require('../controllers/authController')

router.post('/register', register)

router.post('/login', login)

router.get('/verify', auth, verify)

router.post('/logout', auth, logout)

module.exports = router
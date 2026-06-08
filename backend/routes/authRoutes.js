const express = require('express');
const router = express.Router();
const { register, login, googleLogin } = require('../controllers/authController');

// Register route
router.post('/register', register);

// Login route
router.post('/login', login);

// Google login route
router.post('/google', googleLogin);

module.exports = router;
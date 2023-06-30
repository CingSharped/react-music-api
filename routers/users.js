const express = require('express')

const { loginUser, signupUser, addLikedSong, removeLikedSong } = require('../controllers/users')

const router = express.Router()

// Login route
router.post('/login', loginUser)

// Signup route
router.post('/signup', signupUser)

// Add liked song route
router.post('/addsong', addLikedSong)

// Remove liked song route
router.delete('/removesong', removeLikedSong)

module.exports = router
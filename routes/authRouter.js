const router = require('express').Router()
const User = require('mongoose').model('User')

const asyncHandler = require('../middleware/asyncHandler')
const { protect } = require('../middleware/auth')

const { register, login, getMe } = require('../controllers/authControllers')

router.post('/register', asyncHandler(register))

router.post('/login', asyncHandler(login))

router.get('/me', protect, asyncHandler(getMe))

module.exports = router

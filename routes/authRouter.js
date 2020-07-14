const router = require('express').Router()
const User = require('mongoose').model('User')

const asyncHandler = require('../middleware/asyncHandler')

const { register } = require('../controllers/authControllers')

router.post('/register', asyncHandler(register))

module.exports = router

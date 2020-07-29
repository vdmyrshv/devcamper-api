//these two lines is the 'new' way of calling a model
//to prevent duplicate model creation errors
const mongoose = require('mongoose')
const User = mongoose.model('User')

//path module for the photo upload controller
const path = require('path')

const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/asyncHandler')

/**
 * @desc    Register user
 * @route   POST /api/v1/auth/register
 * @access  Public
 */

exports.register = async (req, res, next) => {
	const { name, email, password, role } = req.body

	//create user
	const user = await User.create({
		name,
		email,
		password,
		role
	})

	//rememeber that getSignedToken was greated as UserSchema.methods.getSignedToken - created as a method for the user model
	//so it's accessed by the instance of the model, so lowercase user.getSignedJwtToken()
	//if it was UseSchema.statics, it would be accessed on User
	//const token = user.getSignedJwtToken()

	sendTokenResponse(user, 200, res)
}

/**
 * @desc    Login user
 * @route   POST /api/v1/auth/login
 * @access  Public
 */

exports.login = async (req, res, next) => {
	const { email, password } = req.body

	//validate email and password
	//we're validating here because for registering a user, the model takes care of validation
	//here we're not registering a new User so we'd need to do validation
	//401 error code is unauthorized
	if (!email || !password) {
		return next(
			new ErrorResponse('Please enter a valid email or password', 401)
		)
	}

	//check for user
	//.select here is overriding the fact that we hid the password from being returned in by setting select: false in the
	//UserSchema, so now the password will be returned, saying .select('+password') says we DO want the password
	const user = await User.findOne({ email }).select('+password')

	if (!user) {
		return next(new ErrorResponse('User login not found', 401))
	}

	//check if password matches
	//REMINDER: if the variable is a boolean best to use the format isVariable
	const isMatch = await user.verifyPassword(password)

	if (!isMatch) {
		return next(new ErrorResponse('Invalid password', 401))
	}

	sendTokenResponse(user, 200, res)
}

/**
 * @desc	Get current logged in user
 * @route	POST /api/v1/auth/me
 * @access	Private
 */
exports.getMe = async (req, res, next) => {
	const user = await User.findById(req.user.id)
	res.status(200).json({
		success: true,
		data: user
	})
}

/**
 * @desc	Forgot password
 * @route	POST /api/v1/auth/forgotpassword
 * @access	Public
 */
exports.forgotPassword = async (req, res, next) => {
	const user = await User.findOne({ email: req.body.email })

	if (!user) {
		return next(
			new ErrorResponse(
				`user with email address ${req.body.email} not found`,
				404
			)
		)
	}

	//Get reset token
	const resetToken = user.getResetPasswordToken()

	//
	await user.save({validateBeforeSave: false})

	console.log(resetToken)

	res.status(200).json({
		success: true,
		data: user
	})
}

//get token from model, also create cookie and send response
//this middleware takes care of all of that
const sendTokenResponse = (user, statusCode, res) => {
	//create Token
	const token = user.getSignedJwtToken()

	const options = {
		//how to set expiration to in 30 days
		expires: new Date(
			Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
		),
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production' ? true : false
	}

	res.status(statusCode).cookie('token', token, options).json({
		success: true,
		token
	})
}

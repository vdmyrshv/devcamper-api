//crypto is a core module
const crypto = require('crypto')
const mongoose = require('mongoose')
//Note: bcryptjs is diff from bcrypt, seems to work better with windows
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Please add a name']
	},
	email: {
		type: String,
		required: [true, 'A valid email address is required'],
		unique: [
			true,
			'this email is already in use, please use a different one'
		],
		match: [/\S+@\S+\.\S+/, 'please add a valid email']
	},
	role: {
		type: String,
		enum: ['user', 'publisher'],
		default: 'user'
	},
	password: {
		type: String,
		required: [true, 'please add a password'],
		minlength: [6, 'Password must be 6 characters in length or more'],
		//setting select: false here means that the password will not be returned when the user is created
		select: false
	},
	resetPasswordToken: String,
	resetPasswordExpire: Date,
	createdAt: {
		type: Date,
		default: Date.now
	}
})

//Encrypt password using bcrypt
UserSchema.pre('save', async function (next) {
	//because user is saved with reset passworToken in authcontrollers,
	//we don't want this pre-save hook to run if password is not modified
	if(!this.isModified('password')){
		next()
	}
	//10 is the recommended salt for the password
	const salt = await bcrypt.genSalt(10)
	console.log('PASSWORD BEFORE', this.password)
	this.password = await bcrypt.hash(this.password, salt)
	console.log('PASSWORD', this.password)
	next()
})

//sign JWT and return
//this is .methods. not .statics., so here you're going to later
//call the method on the INSTANCE of the model, not the model itself (if it were .statics.)
UserSchema.methods.getSignedJwtToken = function () {
	return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRE
	})
}

//match user entered password to hashed password stored in document
UserSchema.methods.verifyPassword = async function (password) {
	return await bcrypt.compare(password, this.password)
}

//Generate and hash password token
UserSchema.methods.getResetPasswordToken = function () {
	//generate token
	const resetToken = crypto.randomBytes(20).toString('hex')
	//hash token and set to resetPasswordToken field
	this.resetPasswordToken = crypto
		.createHash('sha256')
		.update(resetToken)
		.digest('hex')

	this.resetPasswordExpire = Date.now() + 10*60*1000

	return resetToken
}

mongoose.model('User', UserSchema)

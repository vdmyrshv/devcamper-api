const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'A valid email address is required'],
        unique: [true, 'this email is already in use, please use a different one'],
        match: [/\S+@\S+\.\S+/, 'please use a valid email']
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

mongoose.model('User', UserSchema)

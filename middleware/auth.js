const User = require('mongoose').model('User')

const jwt = require('jsonwebtoken')
const asyncHandler = require('./asyncHandler')
const ErrorResponse = require('../utils/errorResponse')

exports.protect= asyncHandler(async(req, res, next) => {
    let token

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1]
    } 
    // not using this right now
    // else if (req.cookies?.token){
    //     token = req.cookies.token
    // }

    //make sure token exists
    if(!token){
        return next(new ErrorResponse('Not authorized to access this route', 401))
    }
    
    try {
        //Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        console.log(decoded)

        req.user = await User.findById(decoded.id)
        next()
    } catch (err) {
        next(err)
    }

})

// Grant access to specific roles
exports.authorize = (...roles) => (req, res, next)  => {
    if(!roles.includes(req.user.role)){
        return next(new ErrorResponse(`user role ${req.user.role} is unauthorized to access this route`), 403)
    }   
    next()
}
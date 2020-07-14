//these two lines is the 'new' way of calling a model
//to prevent duplicate model creation errors
const mongoose = require('mongoose')
const User = mongoose.model('User')

//path module for the photo upload controller
const path = require('path')

const ErrorResponse = require('../utils/errorResponse')


/**
 * @desc    Register user
 * @route   POST /api/v1/auth/register
 * @access  Public
 */

 exports.register = async (req, res, next) => {
     res.status(200).json({
         success: true
     })
 }

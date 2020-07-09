//these two lines is the 'new' way of calling a model
//to prevent duplicate model creation errors
const mongoose = require('mongoose')
const Bootcamp = mongoose.model('Bootcamp')

//it's god practice to add a comment header that describes the route, such as jsdoc below

/**
 * @desc get all bootcamps
 * @route GET /api/v1/bootcamps
 * @access Public
 */
exports.getBootcamps = async (req, res, next) => {
	try {
		const bootcamps = await Bootcamp.find()
		res.status(200).json({
			success: true,
			data: bootcamps
		})
	} catch (err) {
		console.log('error getting all bootcamps ', err)
	}
}

/**
 * @desc get single bootcamp
 * @route GET /api/v1/bootcamps/:id
 * @access Public
 */
exports.getBootcamp = async (req, res, next) => {
	try {
		const bootcamp = await Bootcamp.findById(req.params.id)
		res.status(200).json({
			success: true,
			msg: `Got bootcamp with id ${req.params.id}`,
			data: bootcamp
		})
	} catch (err) {
		res.status(500).json({
			message: err
		})
	}
}

/**
 * @desc create a bootcamp
 * @route POST /api/v1/bootcamps
 * @access Private
 */
exports.createBootcamp = async (req, res, next) => {

	try {
		const bootcamp = new Bootcamp(req.body)
		await bootcamp.save()
		res.status(201).send({
			success: true,
			data: bootcamp
		})
	} catch (err) {
		res.status(400).json({
			success: false,
			message: err
		})
	}
}

/**
 * @desc update a bootcamp
 * @route PUT /api/v1/bootcamps
 * @access Private
 */
exports.updateBootcamp = (req, res, next) => {
	res.status(200).json({
		success: true,
		msg: `Update bootcamp ${req.params.id}`
	})
}

/**
 * @desc delete a bootcamp
 * @route DELETE /api/v1/bootcamps
 * @access Private
 */
exports.deleteBootcamp = async (req, res, next) => {
	try {
		const bootcamp = await Bootcamp.findByIdAndRemove(req.params.id)
		res.status(200).json({
			success: true,
			msg: `Deleted bootcamp with id ${req.params.id}`,
			data: bootcamp
		})
	} catch (err) {
		res.status(500).json({
			message: err
		})
	}
}

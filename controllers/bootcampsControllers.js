//these two lines is the 'new' way of calling a model
//to prevent duplicate model creation errors
const mongoose = require('mongoose')
const Bootcamp = mongoose.model('Bootcamp')

//path module for the photo upload controller
const path = require('path')

const ErrorResponse = require('../utils/errorResponse')

const geocoder = require('../utils/geocoder')

//it's god practice to add a comment header that describes the route, such as jsdoc below

/**
 * @desc get all bootcamps
 * @route GET /api/v1/bootcamps
 * @access Public
 */
exports.getBootcamps = async (req, res, next) => {


	res.status(200).json(req.advancedResults)
}

/**
 * @desc get single bootcamp
 * @route GET /api/v1/bootcamps/:id
 * @access Public
 */
exports.getBootcamp = async (req, res, next) => {
	const bootcamp = await Bootcamp.findById(req.params.id)
	if (!bootcamp) {
		return next(
			new ErrorResponse(
				`Cannot find bootcamp with id ${req.params.id}`,
				404
			)
		)
	}
	res.status(200).json({
		success: true,
		msg: `Got bootcamp with id ${req.params.id}`,
		data: bootcamp
	})
}

/**
 * @desc create a bootcamp
 * @route POST /api/v1/bootcamps
 * @access Private
 */
exports.createBootcamp = async (req, res, next) => {
	const bootcamp = await Bootcamp.create(req.body)
	res.status(201).send({
		success: true,
		data: bootcamp
	})
}

/**
 * @desc update a bootcamp
 * @route PUT /api/v1/bootcamps
 * @access Private
 */
exports.updateBootcamp = async (req, res, next) => {
	let bootcamp = await Bootcamp.findById(req.params.id)

	if (!bootcamp) {
		return next(
			new ErrorResponse(
				`Cannot find bootcamp with id ${req.params.id}`,
				404
			)
		)
	}

	//in the options object, new: true sets it so that the returned value is the updated object
	bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true
	})

	res.status(200).json({
		success: true,
		msg: `updated bootcamp with id ${req.params.id}`,
		data: bootcamp
	})
}

/**
 * @desc delete a bootcamp
 * @route DELETE /api/v1/bootcamps/:id
 * @access Private
 */
exports.deleteBootcamp = async (req, res, next) => {
	const bootcamp = await Bootcamp.findById(req.params.id)

	if (!bootcamp) {
		return next(
			new ErrorResponse(
				`Cannot find bootcamp with id ${req.params.id}`,
				422
			)
		)
	}

	//we are NOT doing findbyidanddelete, instead doing remove seperately
	//in order to trigger cascade delete of all courses with bootcamp field belonging to this id
	await bootcamp.remove()

	res.status(200).json({
		success: true,
		msg: `Deleted bootcamp with id ${req.params.id}`,
		data: bootcamp
	})
}

/**
 * @desc get bootcamps within a radius
 * @route GET /api/v1/bootcamps/radius/:zipcode/:distance
 * @access Public
 */
exports.getBootcampsInRadius = async (req, res, next) => {
	const { zipcode, distance } = req.params
	const { latitude, longitude } = (await geocoder.geocode(zipcode))[0]

	//Earth Radius = 3963 mi / 6378 km
	const EARTH_RADIUS_MILES = 3958.8
	const EARTH_RADIUS_KM = 6378.1

	// query would be to get radians by dividing distance of search by earth radius in respective units
	//to use miles divide distance by miles, to use kilometers divide by kilometers
	//divide distance by radius
	const radius = distance / EARTH_RADIUS_MILES

	const area = {
		center: [longitude, latitude],
		radius,
		unique: true,
		spherical: true
	}
	//another way to do this
	// const bootcamps = await Bootcamp.find({
	// 	location: {
	// 		$geoWithin: {
	// 			$centerSphere: [[longitude, latitude], radius]
	// 		}
	// 	}
	// })

	const bootcamps = await Bootcamp.find().circle('location', area)
	res.status(200).json({
		success: true,
		latitude,
		longitude,
		distance,
		results: bootcamps.length,
		data: bootcamps
	})
}

/**
 * @desc upload a photo
 * @route PUT /api/v1/bootcamps/:id/photo
 * @access Private
 */
exports.uploadBootcampPhoto = async (req, res, next) => {
	const bootcamp = await Bootcamp.findById(req.params.id)

	if (!bootcamp) {
		return next(
			new ErrorResponse(
				`Cannot find bootcamp with id ${req.params.id}`,
				422
			)
		)
	}

	if (!req.files) {
		return next(new ErrorResponse('Please upload a file'), 422)
	}

	console.log(req.files)

	const file = req.files.file

	//make sure file is of image type
	if (!file.mimetype.startsWith('image')) {
		return next(new ErrorResponse('Please select an image filetype'), 422)
	}

	//check file size
	if (file.size > process.env.MAX_FILE_UPLOAD) {
		return next(
			new ErrorResponse(
				`File upload size exceeded, please select an image less than ${
					process.env.MAX_FILE_UPLOAD / 1000000
				}MB`
			),
			422
		)
	}

	//create custom filename
	//you can use the path module to get the extension of a file
	file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`

	console.log(file.name)

	file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
		if (err) {
			console.error(err)
			return next(
				new ErrorResponse(`Error uploading file, please try again`),
				503
			)
		}

		await Bootcamp.findByIdAndUpdate(
			req.params.id,
			{ photo: file.name },
			{ new: true, runValidators: true }
		)
	})

	res.status(201).json({
		success: true,
		bootcamp: bootcamp.name,
		data: file.name
	})
}

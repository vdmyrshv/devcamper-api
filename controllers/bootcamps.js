//these two lines is the 'new' way of calling a model
//to prevent duplicate model creation errors
const mongoose = require('mongoose')
const Bootcamp = mongoose.model('Bootcamp')

const ErrorResponse = require('../utils/errorResponse')
const geocoder = require('../utils/geocoder')

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
			count: bootcamps.length,
			data: bootcamps
		})
	} catch (err) {
		next(err)
	}
}

/**
 * @desc get single bootcamp
 * @route GET /api/v1/bootcamps/:id
 * @access Public
 */
exports.getBootcamp = async (req, res, next) => {
	const bootcamp = await Bootcamp.findById(req.params.id)
	if (!bootcamp) {
		return next(err)
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
	const bootcamp = new Bootcamp(req.body)
	await bootcamp.save()
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
	//in the options object, new: true sets it so that the returned value is the updated object
	const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true
	})

	if (!bootcamp) {
		return next(err)
	}

	res.status(200).json({
		success: true,
		msg: `updated bootcamp with id ${req.params.id}`,
		data: bootcamp
	})
}

/**
 * @desc delete a bootcamp
 * @route DELETE /api/v1/bootcamps
 * @access Private
 */
exports.deleteBootcamp = async (req, res, next) => {
	const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)
	if (!bootcamp) {
		return next(err)
	}
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
	const radius = distance/EARTH_RADIUS_MILES

	const area = {
		center: [longitude, latitude],
		radius,
		unique: true,
      	spherical: true
	}

	// const bootcamps = await Bootcamp.find({
	// 	location: {
	// 		$geoWithin: {
	// 			$centerSphere: [[longitude, latitude], radius]
	// 		}
	// 	}
	// })

	const bootcamps = await Bootcamp.find().circle('location', area)
	res.status(200).json({ latitude, longitude, distance, results: bootcamps.length, data: bootcamps })
}

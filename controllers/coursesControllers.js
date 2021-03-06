//these two lines is the 'new' way of calling a model
//to prevent duplicate model creation errors
const Course = require('mongoose').model('Course')
const Bootcamp = require('mongoose').model('Bootcamp')

const ErrorResponse = require('../utils/errorResponse')

//it's god practice to add a comment header that describes the route, such as jsdoc below

/**
 * @desc	get all courses
 * @route	GET /api/v1/courses
 * @route	GET /api/v1/bootcamps/:bootcampId/courses
 * @access	Public
 */
exports.getCourses = async (req, res, next) => {
	let query

	if (req.params.bootcampId) {
		//you can either pass in a string of the field to be populated like so .populate('bootcamp')
		//to get all fields from the bootcamp model
		//or an object with the model name and fields to be populated as below
		const courses = await Course.find({ bootcamp: req.params.bootcampId })

		return res.status(200).json({
			success: true,
			count: courses.length,
			data: courses
		})
	} else {
		res.status(200).json(req.advancedResults)
	}
}

/**
 * @desc	get single course
 * @route	GET /api/v1/courses/:id
 * @access	Public
 */
exports.getCourse = async (req, res, next) => {
	const course = await Course.findById(req.params.id).populate({
		path: 'bootcamp',
		select: 'name description'
	})
	if (!course) {
		return next(
			new ErrorResponse(`No course found with id ${req.params.id}`, 404)
		)
	}
	res.status(200).json({
		success: true,
		msg: `Got course with id ${req.params.id}`,
		data: course
	})
}

/**
 * @desc	create a course
 * @route	POST /api/v1/bootcamps/:bootcampId/courses
 * @access	Private
 */
exports.createCourse = async (req, res, next) => {
	//tack on data fields from request bootcamp ID and user id to create ownership
	req.body.bootcamp = req.params.bootcampId
	req.body.user = req.user.id
	//validation to see if that bootcamp exists before creating a course for it
	const bootcamp = await Bootcamp.findById(req.params.bootcampId)

	if (!bootcamp) {
		return next(
			new ErrorResponse(
				`No bootcamp found with id ${req.params.bootcampId}`,
				422
			)
		)
	}

	//make sure user is course owner
	//bootcamp user id has to be converted to a string for this equivalency to work
	if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
		return next(
			new ErrorResponse(
				`User ${req.user.id} is not authorized to create course for this bootcamp`,
				401
			)
		)
	}

	//you can manually assign values to the body field as seen below,
	//this is to tack on the bootcamp field from the req params
	req.body.bootcamp = req.params.bootcampId

	const course = await Course.create(req.body)

	res.status(201).send({
		success: true,
		data: course
	})
}

/**
 * @desc	update a course
 * @route	PUT /api/v1/courses/:id
 * @access	Private
 */
exports.updateCourse = async (req, res, next) => {
	let course = await Course.findById(req.params.id)

	if (!course) {
		return next(
			new ErrorResponse(`No course found with id ${req.params.id}`, 404)
		)
	}

	//make sure user is course owner
	//bootcamp user id has to be converted to a string for this equivalency to work
	if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
		return next(
			new ErrorResponse(
				`User ${req.user.id} is not authorized to update this course`,
				401
			)
		)
	}

	//in the options object, new: true sets it so that the returned value is the updated object
	course = await Course.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true
	})

	res.status(200).json({
		success: true,
		msg: `updated course with id ${req.params.id}`,
		data: course
	})
}

/**
 * @desc	delete a course
 * @route	DELETE /api/v1/courses/:id
 * @access	Private
 */
exports.deleteCourse = async (req, res, next) => {
	const course = await Course.findById(req.params.id)

	if (!course) {
		return next(
			new ErrorResponse(`No course found with id ${req.params.id}`, 404)
		)
	}

	//make sure user is course owner
	//bootcamp user id has to be converted to a string for this equivalency to work
	if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
		return next(
			new ErrorResponse(
				`User ${req.user.id} is not authorized to delete this course`,
				401
			)
		)
	}

	await course.remove()

	res.status(200).json({
		success: true,
		msg: `Deleted course with id ${req.params.id}`,
		data: course
	})
}

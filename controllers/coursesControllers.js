//these two lines is the 'new' way of calling a model
//to prevent duplicate model creation errors
const Course = require('mongoose').model('Course')

//it's god practice to add a comment header that describes the route, such as jsdoc below

/**
 * @desc get all courses
 * @route GET /api/v1/courses
 * @route GET /api/v1/bootcamps/:bootcampId/courses
 * @access Public
 */
exports.getCourses = async (req, res, next) => {
    let query
    
    if (req.params.bootcampId){
        //you can either pass in a string of the field to be populated like so .populate('bootcamp') 
        //to get all fields from the bootcamp model 
        //or an object with the model name and fields to be populated as below
        query = Course.find({bootcamp: req.params.bootcampId}).populate({
            path: 'bootcamp',
            select: 'name description '
        })
    } else {
        //the populate() method gets the information from the bootcamp instead of just returning the bootcamp's objectId
        query = Course.find().populate('bootcamp')
    }

    const courses = await query

	res.status(200).json({
		success: true,
		count: courses.length,
		data: courses
	})
}

/**
 * @desc get single courses
 * @route GET /api/v1/courses/:id
 * @access Public
 */
exports.getCourse = async (req, res, next) => {
	const course = await Course.findById(req.params.id)
	if (!course) {
		return next(err)
	}
	res.status(200).json({
		success: true,
		msg: `Got course with id ${req.params.id}`,
		data: course
	})
}

/**
 * @desc create a course
 * @route POST /api/v1/courses
 * @access Private
 */
exports.createCourse = async (req, res, next) => {
	const course = new Course(req.body)
	await course.save()
	res.status(201).send({
		success: true,
		data: course
	})
}

/**
 * @desc update a course
 * @route PUT /api/v1/courses
 * @access Private
 */
exports.updateCourse= async (req, res, next) => {
	//in the options object, new: true sets it so that the returned value is the updated object
	const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true
	})

	if (!course) {
		return next(err)
	}

	res.status(200).json({
		success: true,
		msg: `updated course with id ${req.params.id}`,
		data: course
	})
}

/**
 * @desc delete a course
 * @route DELETE /api/v1/courses
 * @access Private
 */
exports.deleteCourse = async (req, res, next) => {
	const course = await Course.findByIdAndDelete(req.params.id)
	if (!course) {
		return next(err)
	}
	res.status(200).json({
		success: true,
		msg: `Deleted course with id ${req.params.id}`,
		data: course
	})
}
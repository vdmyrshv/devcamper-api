//it's god practice to add a comment header that describes the route, such as jsdoc below

/**
 * @desc get all bootcamps
 * @route GET /api/v1/bootcamps
 * @access Public
 */
exports.getBootcamps = (req, res, next) => {
	res.status(200).json({
		success: true,
		msg: 'show all bootcamps',
		hello: req.hello
	})
}

/**
 * @desc get single bootcamp
 * @route GET /api/v1/bootcamps/:id
 * @access Public
 */
exports.getBootcamp = (req, res, next) => {
	res.status(200).json({
		success: true,
		msg: `get bootcamp with id ${req.params.id}`
	})
}

/**
 * @desc create a bootcamp
 * @route POST /api/v1/bootcamps
 * @access Private
 */
exports.createBootcamp = (req, res, next) => {
	res.status(200).json({ success: true, msg: 'show all bootcamps' })
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
exports.deleteBootcamp = (req, res, next) => {
	res.status(200).json({
		success: true,
		msg: 'Delete bootcamp with id ${req.params.id}'
	})
}

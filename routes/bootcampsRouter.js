const router = require('express').Router()

const asyncHandler = require('../middleware/asyncHandler')

//controllers import
const {
	getBootcamps,
	getBootcamp,
	createBootcamp,
	updateBootcamp,
	deleteBootcamp,
	getBootcampsInRadius
} = require('../controllers/bootcampsControllers')


//these two lines re-route anything from that path over to courses
const coursesRouter = require('./coursesRouter')

router.use('/:bootcampId/courses', coursesRouter)

//muchh cleaner way of chaining HTTP method handlers like below:
// route().get() chaining as opposed to single .get() .post() etc... lines of code
router
	.route('/')
	.get(asyncHandler(getBootcamps))
	.post(asyncHandler(createBootcamp))

router
	.route('/:id')
	.get(asyncHandler(getBootcamp))
	.put(asyncHandler(updateBootcamp))
	.delete(asyncHandler(deleteBootcamp))

router
	.route('/radius/:zipcode/:distance')
	.get(asyncHandler(getBootcampsInRadius))

module.exports = router

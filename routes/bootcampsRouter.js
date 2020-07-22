const router = require('express').Router()
const Bootcamp = require('mongoose').model('Bootcamp')

const asyncHandler = require('../middleware/asyncHandler')
const { protect } = require('../middleware/auth')

//controllers import
const {
	getBootcamps,
	getBootcamp,
	createBootcamp,
	updateBootcamp,
	deleteBootcamp,
	getBootcampsInRadius,
	uploadBootcampPhoto
} = require('../controllers/bootcampsControllers')

const advancedResults = require('../middleware/advancedResults')

//these two lines re-route anything from that path over to courses
const coursesRouter = require('./coursesRouter')

router.use('/:bootcampId/courses', coursesRouter)

//muchh cleaner way of chaining HTTP method handlers like below:
// route().get() chaining as opposed to single .get() .post() etc... lines of code
router.route('/:id/photo').put(protect, asyncHandler(uploadBootcampPhoto))

router
	.route('/')
	.get(advancedResults(Bootcamp, 'courses'), asyncHandler(getBootcamps))
	.post(protect,asyncHandler(createBootcamp))

router
	.route('/:id')
	.get(asyncHandler(getBootcamp))
	.put(protect, asyncHandler(updateBootcamp))
	.delete(protect, asyncHandler(deleteBootcamp))

router
	.route('/radius/:zipcode/:distance')
	.get(asyncHandler(getBootcampsInRadius))

module.exports = router

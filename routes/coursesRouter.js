//mergeParams:true allows for re-routing from other route namespaces if a certain path is hit
//for example if /bootcamps/:bootcampId/courses is hit, it re-routes to here
const router = require('express').Router({ mergeParams: true })
const Course = require('mongoose').model('Course')

const asyncHandler = require('../middleware/asyncHandler')

const {
	getCourses,
	getCourse,
	createCourse,
	updateCourse,
	deleteCourse
} = require('../controllers/coursesControllers')

const advancedResults = require('../middleware/advancedResults')

router
	.route('/')
	.get(
		advancedResults(Course, {
			path: 'bootcamp',
			select: 'name description '
		}),
		asyncHandler(getCourses)
	)
	.post(asyncHandler(createCourse))

router
	.route('/:id')
	.get(asyncHandler(getCourse))
	.put(asyncHandler(updateCourse))
	.delete(asyncHandler(deleteCourse))

module.exports = router

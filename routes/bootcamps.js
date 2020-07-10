const express = require('express')
const router = express.Router()

const asyncHandler = require('../middleware/asyncHandler')

//controllers import
const {
	getBootcamps,
	getBootcamp,
	createBootcamp,
	updateBootcamp,
	deleteBootcamp
} = require('../controllers/bootcamps')

//muchh cleaner way of chaining HTTP method handlers like below: 
// route().get() chaining as opposed to single .get() .post() etc... lines of code
router.route('/').get(asyncHandler(getBootcamps)).post(asyncHandler(createBootcamp))

router.route('/:id').get(asyncHandler(getBootcamp)).put(asyncHandler(updateBootcamp)).delete(asyncHandler(deleteBootcamp))

module.exports = router

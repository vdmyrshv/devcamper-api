const express = require('express')
const router = express.Router()

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
router.route('/').get(getBootcamps).post(createBootcamp)

router.route('/:id').get(getBootcamp).put(updateBootcamp).delete(deleteBootcamp)

module.exports = router

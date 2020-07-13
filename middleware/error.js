const ErrorResponse = require('../utils/errorResponse')

module.exports = (err, req, res, next) => {
	let error = {}
	let message = ''

	//equate the statuscode from the err in the catch block to the local error variable for handling in the error middleware
	error.statusCode = err.statusCode
	error.message = err.message

	//console.log(Object.values(err.errors).map(error => error.message).join('\n'))

	//log to console for the dev
	// console.log('message', err.message)
	// console.log('status code', err.statusCode)
	// console.log('name: ', err.name)
	// console.log(err.stack.red)
	// console.log(err.name.brightRed.bold.underline)

	switch (err.name) {
		//invalid ID key format
		case 'CastError':
			message = `improperly formatted id ${err.value}`
			error = new ErrorResponse(message, 404)
			break
		//objectID not found
		case 'ReferenceError':
			if (!message) {
				message = `Resource not found`
				error = new ErrorResponse(message, 404)
			}
			break
		//missing required fields
		case 'ValidationError':
			message =
				'VALIDATION ERROR: ' +
				Object.values(err.errors)
					.map((error, index) => `${index + 1}: ${error.message}`)
					.join(' ')
			error = new ErrorResponse(message, 422)
			break
	}

	if (err.code === 11000) {
		message = 'Resource name already in use, please select unique name'
		error = new ErrorResponse(message, 422)
	}

	res.status(error.statusCode || 500).json({
		success: false,
		error: error.message || 'server error'
	})
}

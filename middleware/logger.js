
/**
 * @desc logs request info to console
 */
module.exports = (req, res, next) => {
	console.log(`method: ${req.method} url: ${req.protocol}://${req.get('host')}${req.originalUrl}`)
	//calling next tells middleware to move on to next piece of middleware
	next()
}

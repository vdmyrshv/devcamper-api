//higher order function that wraps controllers in async try catch block

module.exports = fn => async (req, res, next) => {
    try {
        await fn(req, res, next)
    } catch (err) {
        next(err)
    }
}
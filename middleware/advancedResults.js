const advancedResults = (Model, populate) => async (req, res, next) => {
	let query

	//shallow copy of req.query
	let reqQuery = { ...req.query }

	//array of fields to exclude
	const removeFields = ['select', 'sort', 'page', 'limit']

	//loop over removeFields and delete them from reqQuery
	removeFields.forEach(param => delete reqQuery[param])

	console.log(reqQuery)

	//create query string
	let queryStr = JSON.stringify(reqQuery)

	//create operators ($gt, $gte, $lt, etc..)
	queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)

	//finding resource
	query = Model.find(JSON.parse(queryStr))

	//QUERY
	if (req.query.select) {
		const fields = req.query.select.split(',').join(' ')
		console.log(fields)
		query = query.select(fields)
	}

	//SORT
	if (req.query.sort) {
		const sortBy = req.query.sort.split(',').join(' ')
		console.log(fields)
		query = query.sort(sortBy)
	} else {
		//default
		query = query.sort('-createdAt')
	}

	//PAGINATION
	const page = parseInt(req.query.page) || 1
	const limit = parseInt(req.query.limit) || 25
	const startIndex = (page - 1) * limit
	const endIndex = page * limit
	const total = await Model.countDocuments()

	query = query.skip(startIndex).limit(limit)

	//NOTE: the .populate is added to show the virtual field added as the
	//second argument to the schema object and the .virtual() in the model
	//it's a 'reverse populate' since the field is not there
	//populate is done down here so that it doesn't automatically populate everything at once
	//and only populates what is paginated
	if (populate) {
		query = query.populate(populate)
	}

	//executirng the query
	const results = await query

	//Pagination result
	const pagination = {}

	if (endIndex < total) {
		pagination.next = {
			page: page + 1,
			limit
		}
	}

	if (startIndex > 0) {
		pagination.prev = {
			page: page - 1
		}
	}

	req.advancedResults = {
		success: true,
		count: results.length,
		data: results,
		pagination
	}

	next()
}

module.exports = advancedResults

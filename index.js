const express = require('express')
//if obj is in special location you add an object to the config() method with the path
require('dotenv').config({ path: './config/config.env' })

//middleware
const logger = require('./middleware/logger')
const morgan = require('morgan')
const bodyParser = require('body-parser')

//route files
const bootcamps = require('./routes/bootcamps')

const app = express()

if (process.env.NODE_ENV === 'development') {
	app.use(
		morgan(':method :url :status :res[content-length] - :response-time ms')
	)
}

app.use(bodyParser.json())

//mount routers
app.use('/api/v1/bootcamps', bootcamps)

const PORT = process.env.PORT || 5000

app.listen(PORT, () =>
	console.log(
		`server running in ${process.env.NODE_ENV} mode on port ${PORT}`
	)
)

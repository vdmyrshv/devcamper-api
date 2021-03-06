//if obj is in special location you add an object to the config() method with the path
require('dotenv').config({ path: './config/config.env' })

//package for colorizing the console logs
require('colors')

//the new Stephen Grider syntax for importing models
//these models are required in only once here, 
//as multiple require(model) statements will throw an error on trying to create a duplicate model
//calling a model is like this: const YourModel = mongoose.model('YourModel')
require('./models/Bootcamp')
require('./models/Course')
require('./models/User')

const path = require('path')
const express = require('express')
const cookieParser = require('cookie-parser')
const fileupload = require('express-fileupload')

//database
const connectDB = require('./config/db')

//connect to db simply by calling the function'
connectDB()

//middleware
// const logger = require('./middleware/logger')
const morgan = require('morgan')

//route files
const bootcamps = require('./routes/bootcampsRouter')
const courses = require('./routes/coursesRouter')
const auth = require('./routes/authRouter')
//error handler
const errorHandler = require('./middleware/error')

const app = express()

//cookie parser for adding a req.cookies object
app.use(cookieParser())
//about a year ago, express added a NATIVE BODY PARSER, you don't need body parser anymore
//this substitutes bodyParser.json()
app.use(express.json())

if (process.env.NODE_ENV === 'development') {
	app.use(
		morgan(':method :url :status :res[content-length] - :response-time ms')
	)
}

//file uploading middleware
app.use(fileupload())

//set static folder app.use(express.static('public'))
app.use(express.static(path.join(__dirname, 'public')))

//mount routers onto the route
app.use('/api/v1/auth', auth)
app.use('/api/v1/bootcamps', bootcamps)
app.use('/api/v1/courses', courses)
app.use(errorHandler)

const PORT = process.env.PORT || 3000

const server = app.listen(PORT, () =>
	console.log(
		`server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow
			.bold
	)
)

//handle unhandled rejections
//NOTE: this won't work if the connection string is handled in a try{}catch{} block
// process.on('unhandledRejection', (err, promise) => {
// 	console.log('Error: ${err.message}'.red.bold)
// 	//close server and exit process
// 	//basically you want the app to fail if this happens
// 	server.close(() => process.exit(1))
// })

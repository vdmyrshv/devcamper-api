require('dotenv').config({ path: './config/config.env' })

const fs = require('fs')
const path = require('path')
const process = require('process')

//Load files
require('./models/Bootcamp')
require('./models/Course')
require('./models/Review')
require('./models/User')
const mongoose = require('mongoose')
const Bootcamp = mongoose.model('Bootcamp')
const Course = mongoose.model('Course')
const Review = mongoose.model('Review')
const User = mongoose.model('User')

require('colors')

//Connect to DB
mongoose.connect(process.env.MONGO_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true,
	useFindAndModify: false
})

//Read JSON Files
const bootcamps = JSON.parse(
	fs.readFileSync(path.join(__dirname, '_data/bootcamps.json'), 'utf-8')
)
const courses = JSON.parse(
	fs.readFileSync(path.join(__dirname, '_data/courses.json'), 'utf-8')
)
const reviews = JSON.parse(
	fs.readFileSync(path.join(__dirname, '_data/reviews.json'), 'utf-8')
)
const users = JSON.parse(
	fs.readFileSync(path.join(__dirname, '_data/users.json'), 'utf-8')
)

//import into DB
const importData = async data => {
	try {
		let length
		switch (data) {
			case 'bootcamps':
				await Bootcamp.create(bootcamps)
				length = await Bootcamp.countDocuments()
				break

			case 'courses':
				await Course.create(courses)
				length = await Course.countDocuments()
				break
			case 'reviews':
				await Review.create(reviews)
				length = await Review.countDocuments()
				break
			case 'users':
				await Course.create(users)
				length = await User.countDocuments()
				break
			default: {
				throw new Error('data not found!'.red)
			}
		}
		console.log(`Successfully imported ${length} ${data}`.green.inverse)
		process.exit()
	} catch (err) {
		console.error(err)
		process.exit()
	}
}

//delete data
const deleteData = async data => {
	try {
		let length
		switch (data) {
			case 'bootcamps':
				length = await Bootcamp.countDocuments()
				await Bootcamp.deleteMany()
				break
			case 'courses':
				length = await Course.countDocuments()
				await Course.deleteMany()
				break
			case 'reviews':
				length = await Review.countDocuments()
				await Review.deleteMany()
				break
			case 'users':
				length = await User.countDocuments()
				await User.deleteMany()
				break
			default:
				throw new Error('data not found!'.red)
		}
		console.log(`Successfully deleted ${length} ${data}`.green.inverse)
		process.exit()
	} catch (err) {
		console.error(err)
		process.exit()
	}
}

if (process.argv[3] === '--import') {
	importData(process.argv[2])
} else if (process.argv[3] == '--delete') {
	deleteData(process.argv[2])
}

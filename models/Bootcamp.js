const mongoose = require('mongoose')

//this is an example of a GeoJSON subdocument
const PointSchema = new mongoose.Schema({
	type: {
		type: String,
		enum: ['Point'],
		required: true
	},
	coordinates: {
		type: [Number],
		required: true
	}
})

const BootcampSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'please add a name'],
		unique: true,
		trim: true,
		maxlength: [50, 'name cannot be more than 50 characters long']
	},
	slug: String,
	description: {
		type: String,
		required: [true, 'please add a description'],
		maxlength: [500, 'name cannot be more than 50 characters long']
	},
	website: {
		type: String,
		match: [
			/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
			'please use a valid URL with HTTP or HTTPS'
		]
	},
	phone: {
		type: String,
		maxlength: [20, 'Phone number cannot be longer than 20 characters']
	},
	email: {
		type: String,
		match: [/\S+@\S+\.\S+/, 'please use a valid email']
	},
	address: {
		type: String,
		required: true
	},

	// location: {
	// 	//this is the schema for a GeoJSON Point
	// 	type: {
	// 		type: String, // Don't do `{ location: { type: String } }`
	// 		enum: ['Point'], // 'location.type' must be 'Point'
	// 		required: true
	// 	},
	// 	coordinates: {
	// 		type: [Number],
	// 		required: true,
	// 		index: '2dsphere'
	// 	},
	// 	formattedAddress: String,
	// 	street: String,
	// 	city: String,
	// 	state: String,
	// 	zipcode: String,
	// 	country: String
	// },
	careers: {
		//array of strings
		type: [String],
		required: true,
		enum: [
			'Web Development',
			'Mobile Development',
			'UI/UX',
			'Data Science',
			'Business',
			'Other'
		]
	},
	averageRating: {
		type: Number,
		min: [1, 'Rating must be at least a 1'],
		max: [10, 'Rating must not be more than 10']
	},
	averageCost: Number,
	photo: {
		type: String,
		default: 'no-photo.jpg'
	},
	jobAssistance: {
		type: Boolean,
		default: false
	},
	jobGuarantee: {
		type: Boolean,
		default: false
	},
	acceptGi: {
		type: Boolean,
		default: false
	},
	createdAt: {
		type: Date,
		default: Date.now
	}
})

mongoose.model('Bootcamp', BootcampSchema)

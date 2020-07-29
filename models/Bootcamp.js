const mongoose = require('mongoose')
const slugify = require('slugify')
const geocoder = require('../utils/geocoder')

const BootcampSchema = new mongoose.Schema(
	{
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
		location: {
			//this is the schema for a GeoJSON Point
			type: {
				type: String, // Don't do `{ location: { type: String } }`
				enum: ['Point'] // 'location.type' must be 'Point'
			},
			coordinates: {
				type: [Number],
				index: '2dsphere'
			},
			formattedAddress: String,
			street: String,
			city: String,
			state: String,
			zipcode: String,
			country: String
		},
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
		},
		user: {
			type: mongoose.Schema.ObjectId,
			ref: 'User',
			required: true
		}
	},
	{
		//these two properties enable the creation of virtuals
		toJSON: {
			virtuals: true
		},
		toObject: {
			virtuals: true
		}
	}
)

//create bootcamp slug from the name
BootcampSchema.pre('save', function (next) {
	this.slug = slugify(this.name, {
		lower: true
	})
	//DON'T FORGET NEXT() TO MOVE ON TO NEXT MIDDLEWARE!
	next()
})

//create geocoded data from the address
//IMPORTANT: if there are multiple hooks, they have to take in 'next' as an argument
BootcampSchema.pre('save', async function (next) {
	//for async await functions, the await statement must be wrapped in parenthesis
	const geoCoords = (await geocoder.geocode(this.address))[0]

	const {
		latitude,
		longitude,
		formattedAddress,
		streetName: street,
		city,
		countryCode: country,
		zipcode,
		stateCode: state
	} = geoCoords

	console.log(JSON.stringify(geoCoords))

	this.location = {
		type: 'Point',
		coordinates: [longitude, latitude],
		formattedAddress,
		street,
		city,
		state,
		zipcode,
		country
	}
	this.address = undefined
	//DON'T FORGET NEXT() TO MOVE ON TO NEXT MIDDLEWARE!
	next()
})

//CASCADE DELETE: cascade delete of all courses from a specific bootcamp that is being deleted
BootcampSchema.pre('remove', async function (next) {
	console.log(`courses being removed from bootcamp ${this._id}`)
	await this.model('Course').deleteMany({bootcamp: this._id})
	next()
})

// Reverse populate a 'virtual field' with virtuals
// virtual fields are not stored in the db
BootcampSchema.virtual('courses', {
	ref: 'Course',
	localField: '_id',
	foreignField: 'bootcamp',
	justOne: false //we want an array of courses, not just one, this setting returns an array of all
})

mongoose.model('Bootcamp', BootcampSchema)

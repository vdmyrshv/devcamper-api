const mongoose = require('mongoose')

const CourseSchema = new mongoose.Schema({
	title: {
		type: String,
		required: [true, 'please add a course title'],
		trim: true
	},
	description: {
		type: String,
		required: [true, 'please add a description']
	},
	weeks: {
		type: String,
		required: [true, 'please add a the number of weeks']
	},
	tuition: {
		type: Number,
		required: [true, 'please add the tuition cost']
	},
	minimumSkill: {
		type: String,
		required: [true, 'please add minimum skill level'],
		enum: ['beginner', 'intermediate', 'advanced']
	},
	scholarshopAvailable: {
		type: Boolean,
		default: false
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
	bootcamp: {
		type: mongoose.Schema.ObjectId,
		ref: 'Bootcamp',
		required: true
	}
})

//this is how you define a static method on the schema
//this is a static method for the CourseSchema to get the average of course tuitions
CourseSchema.statics.getAverageCost = async function (bootcampId) {
	console.log('calculating average cost...'.magenta.inverse)

	const obj = await this.aggregate([
		{ $match: { bootcamp: bootcampId } },
		{ $group: { _id: '$bootcamp', averageCost: { $avg: '$tuition' } } }
	])

    const { averageCost } = obj[0]

	try {
        //IMPORTANT: you can access another model from the current model
        //by using this.model('Modelname')
		await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
			averageCost: Math.ceil(averageCost)
        })
        
	} catch (err) {
        console.error(`Error calculating the average bootcamp cost: ${err}`)
    }
}

//call getAverageCost AFTER save
CourseSchema.post('save', function () {
	//you call a mongo static method with this.constructor
	this.constructor.getAverageCost(this.bootcamp)
})

//call getAverageCost BEFORE remove
CourseSchema.pre('remove', function () {
	//you call a mongo static method with this.constructor
	this.constructor.getAverageCost(this.bootcamp)
})

mongoose.model('Course', CourseSchema)

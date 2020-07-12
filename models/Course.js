const mongoose = require('mongoose')

const CourseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'please add a course title'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'please add a description'],
        
    },
    weeks: {
        type: String,
        required: [true, 'please add a the number of weeks'],

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

mongoose.model('Course', CourseSchema)

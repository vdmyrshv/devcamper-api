const mongoose = require('mongoose')

const BootcampSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'please add a name'],
        unique: true,
        trim: true,
        
    }
})

module.exports = mongoose.model('Bootcamp', BootcampSchema)
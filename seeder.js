require('dotenv').config({ path: './config/config.env' })

const fs = require('fs')
const path = require('path') 
const process = require('process')

//Load files
require('./models/Bootcamp')
const mongoose = require('mongoose')
const Bootcamp = mongoose.model('Bootcamp')

require('colors')

//Connect to DB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
})

//Read JSON Files
const bootcamps = JSON.parse(fs.readFileSync(path.join(__dirname, '_data/bootcamps.json'), 'utf-8'))
console.log(bootcamps)

//import into DB
const importData = async () => {
    try {
        await Bootcamp.create(bootcamps)
        console.log('Data imported... '.green.inverse)
        process.exit()
    } catch (err) {
        console.error(err)
    }
}

//delete data
const deleteData = async () => {
    try {
        await Bootcamp.deleteMany()
        console.log('Data destroyed... '.red.inverse)
        process.exit()
    } catch (err) {
        console.error(err)
    }
}

if(process.argv[2] === '--import') {
    importData()
} else if (process.argv[2] == '--delete'){
    deleteData()
}
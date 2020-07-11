const path = require('path')

//there was a bug here retrieving the env variables, specifying the absolute path with the path lib solved it
// require('dotenv').config({path: path.join(__dirname, '../config/config.env')})
//problem was solved by putting dotenv config file above the require(schema)
require('colors')

const NodeGeocoder = require('node-geocoder')

const options = {
    provider: process.env.GEOCODER_PROVIDER,
    httpAdapter: 'https',
	apiKey: process.env.GEOCODER_API_KEY,
	formatter: null
}

module.exports = NodeGeocoder(options)

const express = require('express')
//if obj is in special location you add an object to the config() method with the path
require('dotenv').config({ path: './config/config.env' })

const app = express()

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`))

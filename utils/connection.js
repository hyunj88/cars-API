/////////////////////////////////////
//// Import Dependencies         ////
/////////////////////////////////////
require('dotenv').config() // Load my ENV file's variables
const mongoose = require('mongoose') // import the mongoose library

/////////////////////////////////////
//// Database Connection         ////
/////////////////////////////////////
// set up inputs for the database connect function
const DATABASE_URL = process.env.DATABASE_URL
// database config object
const CONFIG = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

// establish database connection
mongoose.connect(DATABASE_URL, CONFIG)

// Tell mongoose what to do with certain events
// what happens when we open, diconnect, or get an error
mongoose.connection
    .on('open', () => console.log('Connected to Mongoose'))
    .on('close', () => console.log('Disconnected from Mongoose'))
    .on('error', (err) => console.log('An error occurred: \n', err))

/////////////////////////////////////
//// Export our Connection       ////
/////////////////////////////////////
module.exports = mongoose
//////////////////////////////////////////////////////////////
//// Our schema and model for the fruit resource          ////
//////////////////////////////////////////////////////////////
const mongoose = require('../utils/connection')

// destructure the Schema and model functions from mongoose
const { Schema, model } = mongoose

// fruits schema
const carSchema = new Schema({
    make: {
        type: String
    },
    model: {
        type: String
    },
    color: {
        type: String
    },
    year: {
        type: Number
    }
})

// make the car model
// the model method takes two arguments
// the first is what we call our model
// the second is the schema used to build the model
const Car = model('Car', carSchema)

//////////////////////////
//// Export our Model ////
//////////////////////////
module.exports = Car
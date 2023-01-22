//////////////////////////////////////////////////////////////
//// Our schema and model for the fruit resource          ////
//////////////////////////////////////////////////////////////
const mongoose = require('../utils/connection')
// import our commentSchema, to use as a subdocument
const commentSchema = require('./comment')

// destructure the Schema and model functions from mongoose
const { Schema, model } = mongoose

// cars schema
const carSchema = new Schema({
    make: {
        type: String
    },
    model: {
        type: String
    },
    year: {
        type: Number
    },
    goodToDrive: {
        type: Boolean
    },
    owner: {
        // set up an objectId reference
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    comments: [commentSchema]
}, { timestamps: true})

// make the car model
const Car = model('Car', carSchema)

//////////////////////////
//// Export our Model ////
//////////////////////////
module.exports = Car
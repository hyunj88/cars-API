/////////////////////////////////////
//// Import Dependencies         ////
/////////////////////////////////////
const express = require('express') // import the express framework

const morgan = require('morgan') // import the morgan request logger
require('dotenv').config() // Load my ENV file's variables
const path = require('path') // import path module
const CarRouter = require('./controllers/carControllers')


/////////////////////////////////////
//// Import Our Models           ////
/////////////////////////////////////
const Car = require('./models/car')

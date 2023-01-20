/////////////////////////////////////
//// Import Dependencies         ////
/////////////////////////////////////
const express = require('express') // import the express framework
const morgan = require('morgan') // import the morgan request logger
const session = require('express-session') //import the expresss-session package
const MongoStore = require('connect-mongo') // import the connect-mongo package(for sessions)
require('dotenv').config()

/////////////////////////////////////
//// Middleware function         ////
/////////////////////////////////////
// build a function that will take the entire app as an argument, and run requests through all of the middlware
const middleware = (app) => {
    // middleware runs before all the routes.
    // every request is processed through middleware before mongoose can do anything with it
    app.use(morgan('tiny')) // this is for request logging, the 'tiny' argument declares what size of morgan log to use
    app.use(express.urlencoded({ extended: true })) //this parses urlEncoded request bodies(useful for POST and PUT requests)
    // using express.static('public) allows us to serve a single CSS stylesheet across our application where we want to.
    app.use(express.static('public')) // this serves static files from the 'public' folder
    app.use(express.json()) // parses incoming request payloads with JSON
    // here, we set up and utilize a session function
    app.use(
        session({
            secret: process.env.SECRET,
            store: MongoStore.create({
                mongoUrl: process.env.DATABASE_URL
            }),
            saveUninitialized: true,
            resave: false
        })
    )
}

///////////////////////////////////////////
//// Export middleware function        ////
///////////////////////////////////////////
module.exports = middleware
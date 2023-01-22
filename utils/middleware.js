/////////////////////////////////////
//// Import Dependencies         ////
/////////////////////////////////////
const express = require('express') // import the express framework
const morgan = require('morgan') // import the morgan request logger
const session = require('express-session') //import the expresss-session package
const MongoStore = require('connect-mongo') // import the connect-mongo package(for sessions)
require('dotenv').config()
const methodOverride = require('method-override')

/////////////////////////////////////
//// Middleware function         ////
/////////////////////////////////////
const middleware = (app) => {

    // method-override allows us to send PUT, PATCH, DELETE, and other requests from a form, by defining it with '_method'
    app.use(methodOverride('_method'))
    app.use(morgan('tiny'))
    app.use(express.urlencoded({ extended: true }))
    app.use(express.static('public'))
    app.use(express.json())
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
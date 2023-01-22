/////////////////////////////////////
//// Import Dependencies         ////
/////////////////////////////////////
const express = require('express')
const User = require('../models/user')
const bcrypt = require('bcryptjs')

/////////////////////////////////////
//// Create Router               ////
/////////////////////////////////////
const router = express.Router()

//////////////////////////////
//// Routes               ////
//////////////////////////////
// GET -> /users/signup
// Renders a liquid page with the sign up form
router.get('/signup', (req, res) => {
    res.render('users/signup')
})

// POST -> /users/signup
// This route creates new users in our db
router.post('/signup', async (req, res) => {
    // this route will take a req.body and use that data to create a user
    const newUser = req.body
    newUser.password = await bcrypt.hash(
        newUser.password,
        await bcrypt.genSalt(10)
    )
    // then create the user
    User.create(newUser)
        .then(user => {
            // console.log('new user created \n', user)
            // res.status(201).json({ username: user.username })
            res.redirect('/users/login')
        })
        // if there is an error, handle the error
        .catch(err => {
            console.log(err)
            // res.json(err)
            res.redirect(`/error?error=username%20taken`)
        })
})

// GET -> /users/login
// Renders a liquid page with the login form
router.get('/login', (req, res) => {
    res.render('users/login')
})

// POST -> /users/login
// This route creates new session in our db(and in the browser)
router.post('/login', async (req, res) => {
    // first we want to destructure the username and password from our req.body
    const { username, password } = req.body

    // search the db, for a user with a specific username
    User.findOne({ username })
        .then(async (user) => {
            // check if that user exists
            if (user) {
                const result = await bcrypt.compare(password, user.password)

                if (result) {
                    req.session.username = username
                    req.session.loggedIn = true
                    req.session.userId = user.id

                    // console.log('this is req.session \n', req.session)
                    // res.status(201).json({ username: user.username })
                    res.redirect('/')
                } else {
                    // if the passwords dont match, send the user a message
                    // res.json({ error: 'username or password is incorrect' })
                    res.redirect(`/error?error=username%20or%20password%20is%20incorrect`)
                }
            } else {
                // if the user does not exist, we respond with a message saying so
                // res.json({ error: 'user does not exist' })
                res.redirect(`/error?error=user%20does%20not%20exist`)
            }

        })
        .catch(err => {
            console.log(err)
            // res.json(err)
            res.redirect(`/error?error=${err}`)
        })
})

// GET -> /users/logout
// This route renders a page that allows the user to log out
router.get('/logout', (req, res) => {
    res.render('users/logout')
})

// DELETE -> /users/logout
// This route destroys a session in our db(and in the browser)
router.delete('/logout', (req, res) => {
    // destroy the session and send an appropriate response
    req.session.destroy(() => {
        console.log('this is req.session upon logout \n', req.session)
        // res.sendStatus(204)
        res.redirect('/')
    })
})


//////////////////////////////
//// Export Router        ////
//////////////////////////////
module.exports = router
/////////////////////////////////////
//// Import Dependencies         ////
/////////////////////////////////////
const express = require('express')
const Car = require('../models/car')


/////////////////////////////////////
//// Create Router               ////
/////////////////////////////////////
const router = express.Router()

//////////////////////////////
//// Routes               ////
//////////////////////////////

// INDEX route 
// Read -> finds and displays all cars
router.get('/', (req, res) => {
    // find all the cars
    Car.find({})
        // this function is called populate, and it's able to retrieve info from other documents in other collections
        .populate('owner', 'username')
        .populate('comments.driver', '-password')
        // send json if successful
        .then(cars => { 
            // now that we have liquid installed, we're going to use render as a response for our controllers
            res.render('cars/index', { cars })
        })
        // catch errors if they occur
        .catch(err => {
            console.log(err)
            res.status(404).json(err)
        })
})

// CREATE route
// Create -> receives a request body, and creates a new document in the database
router.post('/', (req, res) => {
    req.body.owner = req.session.userId
    const newCar = req.body
    Car.create(newCar)
        // send a 201 status, along with the json response of the new car
        .then(car => {
            res.status(201).json({ car: car.toObject() })
        })
        // send an error if one occurs
        .catch(err => {
            console.log(err)
            res.status(404).json(err)
        })
})

// GET route
// Index -> This is a user specific index route
// this will only show the logged in user's cars
router.get('/mine', (req, res) => {
    // find cars by ownership, using the req.session info
    Car.find({ owner: req.session.userId })
        .populate('owner', 'username')
        .populate('comments.driver', '-password')
        .then(cars => {
            // if found, display the cars
            res.status(200).json({ cars: cars })
        })
        .catch(err => {
            // otherwise throw an error
            console.log(err)
            res.status(400).json(err)
        })
})

// PUT route
// Update -> updates a specific car(only if the car's owner is updating)
router.put('/:id', (req, res) => {
    const id = req.params.id
    Car.findById(id)
    .then(car => {
        // if the owner of the car is the person who is logged in
        if (car.owner == req.session.userId) {
            // and send success message
            res.sendStatus(204)
            // update and save the car
            return car.updateOne(req.body)
        } else {
            // otherwise send a 401 unauthorized status
            res.sendStatus(401)
        }
    })
    .catch(err => {
        console.log(err)
        res.status(400).json(err)
    })
})

// DELETE route
// Delete -> delete a specific car
router.delete('/:id', (req, res) => {
    
    const id = req.params.id
    Car.findById(id)
    .then(car => {
        // if the owner of the car is the person who is logged in
        if (car.owner == req.session.userId) {
            // send success message
            res.sendStatus(204)
            // delete the car
            return car.deleteOne()
        } else {
            // otherwise send a 401 unauthorized status
            res.sendStatus(401)
        }
    })
        .catch(err => {
            console.log(err)
            res.status(400).json(err)
        })
})

// SHOW route
// Read -> finds and displays a single resource
router.get('/:id', (req, res) => {
    // get the id -> save to a variable
    const id = req.params.id
    // use a mongoose method to find using that id
    Car.findById(id)
        .populate('comments.driver', 'username')
        // send the car as json upon success
        .then(car => {
            res.json({ car: car })
        })
        // catch any errors
        .catch(err => {
            console.log(err)
            res.status(404).json(err)
        })
})

//////////////////////////////
//// Export Router        ////
//////////////////////////////
module.exports = router
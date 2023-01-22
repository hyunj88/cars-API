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
    const { username, loggedIn, userId } = req.session
    Car.find({})
        // populate function: it's able to retrieve info from other documents in other collections
        .populate('owner', 'username')
        .populate('comments.driver', '-password')
        .then(cars => {
            res.render('cars/index', { cars, username, loggedIn, userId })
        })
        .catch(err => {
            console.log(err)
            res.redirect(`/error?error=${err}`)
        })
})

// GET for the new page
// shows a form where a user can create a new car
router.get('/new', (req, res) => {
    res.render('cars/new', { ...req.session })
})

// CREATE route
// Create -> receives a request body, and creates a new document in the database
router.post('/', (req, res) => {
    req.body.owner = req.session.userId
    req.body.goodToDrive = req.body.goodToDrive === 'on' ? true : false
    const newCar = req.body
    Car.create(newCar)
        .then(car => {
            res.redirect(`/cars/${car.id}`)
        })
        .catch(err => {
            console.log(err)
            res.redirect(`/error?error=${err}`)
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
            // res.status(200).json({ cars: cars })
            res.render('cars/index', { cars, ...req.session })
        })
        .catch(err => {
            console.log(err)
            // res.status(400).json(err)
            res.redirect(`/error?error=${err}`)
        })
})

// GET route for getting json for specific user cars
// Index -> This is a user specific index route
// this will only show the logged in user's cars
router.get('/json', (req, res) => {
    // find cars by ownership, using the req.session info
    Fruit.find({ owner: req.session.userId })
        .populate('owner', 'username')
        .populate('comments.driver', '-password')
        .then(cars => {
            // res.status(200).json({ cars: cars })
            res.render('cars/index', { cars, ...req.session })
        })
        .catch(err => {
            console.log(err)
            res.status(400).json(err)
        })
})

// GET request -> edit route
// shows the form for updating a car
router.get('/edit/:id', (req, res) => {
    const carId = req.params.id
    Car.findById(carId)
        .then(car => {
            res.render('cars/edit', { car, ...req.session })
        })
        .catch(err => {
            res.redirect(`/error?error=${err}`)
        })
})

// PUT route
// Update -> updates a specific car (only if the car's owner is updating)
router.put('/:id', (req, res) => {
    const id = req.params.id
    req.body.goodToDrive = req.body.goodToDrive === 'on' ? true : false
    Car.findById(id)
    .then(car => {
        if (car.owner == req.session.userId) {
            // res.sendStatus(204)
            // update and save the car
            return car.updateOne(req.body)
        } else {
            // res.sendStatus(401)
            res.redirect(`/error?error=You%20Are%20not%20allowed%20to%20edit%20this%20car`)
        }
    })
    .then(() => {
        res.redirect(`/cars/mine`)
    })
    .catch(err => {
        console.log(err)
        // res.status(400).json(err)
        res.redirect(`/error?error=${err}`)
    })
})

// DELETE route
// Delete -> delete a specific car
router.delete('/:id', (req, res) => {
    
    const id = req.params.id
    Car.findById(id)
    .then(car => {
        if (car.owner == req.session.userId) {
            // res.sendStatus(204)
            // delete the car
            return car.deleteOne()
        } else {
            // res.sendStatus(401)
            res.redirect(`/error?error=You%20Are%20not%20allowed%20to%20delete%20this%20car`)
        }
    })
    .then(() => {
        res.redirect('/cars/mine')
    })
        .catch(err => {
            console.log(err)
            // res.status(400).json(err)
            res.redirect(`/error?error=${err}`)
        })
})

// SHOW route
// Read -> finds and displays a single resource
router.get('/:id', (req, res) => {
    const id = req.params.id
    Car.findById(id)
        .populate('comments.driver', 'username')
        .then(car => {
            // res.json({ car: car })
            res.render('cars/show.liquid', {car, ...req.session})
        })
        .catch(err => {
            console.log(err)
            // res.status(404).json(err)
            res.redirect(`/error?error=${err}`)
        })
})

//////////////////////////////
//// Export Router        ////
//////////////////////////////
module.exports = router
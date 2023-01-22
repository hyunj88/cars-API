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

// POST -> `/comments/<someCarId>`
router.post('/:carId', (req, res) => {
    const carId = req.params.carId
    if (req.session.loggedIn) {
        req.body.driver = req.session.userId
        const theComment = req.body
        Car.findById(carId)
            .then(car => {
                car.comments.push(theComment)
                return car.save()
            })
            .then(car => {
                // res.status(201).json({ car: car })
                res.redirect(`/cars/${car.id}`)
            })
            .catch(err => {
                console.log(err)
                // res.status(400).json(err)
                res.redirect(`/error?error=${err}`)
            })
    } else {
        // res.sendStatus(401) //send a 401-unauthorized
        res.redirect(`/error?error=You%20Are%20not%20allowed%20to%20comment%20on%20this%20car`)
    }
})

// DELETE -> `/comments/delete/<someCarId>/<someCommentId>`
router.delete('/delete/:carId/:commId', (req, res) => {
    const { carId, commId } = req.params
    Car.findById(carId)
        .then(car => {
            const theComment = car.comments.id(commId)
            console.log('this is the comment to be deleted: \n', theComment)
            if (req.session.loggedIn) {
                // if they are the driver, allow them to delete
                if (theComment.driver == req.session.userId) {
                    // use built in method - remove()
                    theComment.remove()
                    car.save()
                    // res.sendStatus(204) //send 204 no content
                    res.redirect(`/cars/${car.id}`)
                } else {
                    res.redirect(`/error?error=You%20Are%20not%20allowed%20to%20delete%20this%20comment`)
                }
            } else {
                res.redirect(`/error?error=You%20Are%20not%20allowed%20to%20delete%20this%20comment`)
            }
        })
        .catch(err => {
            console.log(err)
            res.redirect(`/error?error=${err}`)
        })
})

//////////////////////////////
//// Export Router        ////
//////////////////////////////
module.exports = router
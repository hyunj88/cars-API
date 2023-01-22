/////////////////////////////////////
//// Import Dependencies         ////
/////////////////////////////////////
const mongoose = require('../utils/connection')
const Car = require('./car')

/////////////////////////////////////
//// Seed Script code            ////
/////////////////////////////////////
const db = mongoose.connection

db.on('open', () => {
    const startCars = [
        { make: 'Honda', model: 'Civic', year: 2020, goodToDrive: true },
        { make: 'Ford', model: 'Focus', year: 2010, goodToDrive: false },
        { make: 'Toyota', model: 'Camry', year: 2018, goodToDrive: true },
        { make: 'BMW', model: 'M3', year: 1988, goodToDrive: true },
        { make: 'Audi', model: 'A4', year: 2009, goodToDrive: false }
    ]
    Car.deleteMany({})
        .then(() => {
            Car.create(startCars)
                .then(data => {
                    console.log('here are the created fruits: \n', data)
                    db.close()
                })
                .catch(err => {
                    console.log('The following error occurred: \n', err)
                    db.close()
                })
        })
        .catch(err => {
            console.log(err)
            db.close()
        })
})
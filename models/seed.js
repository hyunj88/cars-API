/////////////////////////////////////
//// Import Dependencies         ////
/////////////////////////////////////
const mongoose = require('../utils/connection')
const Car = require('./car')

/////////////////////////////////////
//// Seed Script code            ////
/////////////////////////////////////
// first, we'll save our db connection to a variable
const db = mongoose.connection

db.on('open', () => {
    // array of starter resources(cars)
    const startCars = [
        { make: 'Honda', model: 'Civic', goodToDrive: true, year: 2020 },
        { make: 'Ford', model: 'Focus', goodToDrive: false, year: 2010 },
        { make: 'Toyota', model: 'Camry', goodToDrive: true, year: 2018 },
        { make: 'BMW', model: 'M3', goodToDrive: true, year: 1988 },
        { make: 'Audi', model: 'A4', goodToDrive: false, year: 2009 },
    ]
    // delete every car in the database(all instances of this resource)
    Car.deleteMany({})
        .then(() => {
            // seed(create) our starter fruits
            Fruit.create(startCars)
                // tell app what to do with success and failures
                .then(data => {
                    console.log('here are the created fruits: \n', data)
                    // once it's done, we close the connection
                    db.close()
                })
                .catch(err => {
                    console.log('The following error occurred: \n', err)
                    // close the connection
                    db.close()
                })
        })
        .catch(err => {
            console.log(err)
            // close the connection
            db.close()
        })
})
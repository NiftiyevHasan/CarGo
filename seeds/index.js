const Cargo = require('../models/cargo');
const cities = require('./cities');
const { type } = require('./seedHelpers');

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/cargoapp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("~~~~~~~~~~ DATABASE CONNECTED! ~~~~~~~~~~")
});

const sampleArray = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Cargo.deleteMany({});
    for (let index = 0; index < 50; index++) {
        const random100 = Math.floor(Math.random() * 100);

        const randomCargo = new Cargo({
            type: `${sampleArray(type)}`,
            weight: random100 + 1,
            location: `${cities[random100 * 10].city}`,
            destination: `${cities[(random100 * 10 + 150) % 1000].city}`
        })
        await randomCargo.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});

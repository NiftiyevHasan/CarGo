const Cargo = require('../models/cargo');
const cities = require('./cities');
const { type } = require('./seedHelpers');
require('dotenv').config();
const mongoose = require('mongoose');
const dbUrl = process.env.DB_URL;

mongoose.connect(dbUrl, {
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
    for (let index = 0; index < 500; index++) {
        const random100 = Math.floor(Math.random() * 100);

        const randomCargo = new Cargo({
            type: `${sampleArray(type)}`,
            weight: random100 + 1,
            author: '606a42d33a5c540015bb1526',
            location: `${cities[random100 * 10].city}`,
            destination: `${cities[(random100 * 10 + 150) % 1000].city}`,
            geometry: {
                type: 'Point',
                coordinates: [cities[random100 * 10].longitude,
                                cities[random100 * 10].latitude]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dgviuwbga/image/upload/v1616777099/CarGO/photo-1595246007497-15e0ed4b8d96_msx3jh.jpg',
                    filename: 'CarGO/photo-1595246007497-15e0ed4b8d96_msx3jh'
                },
                {
                    url: 'https://res.cloudinary.com/dgviuwbga/image/upload/v1616638908/CarGO/c9sac70bhyorjbq7ffs9.jpg',
                    filename: 'CarGO/c9sac70bhyorjbq7ffs9'
                },
                {
                    url: 'https://res.cloudinary.com/dgviuwbga/image/upload/v1616638110/CarGO/oodxnztjtdefqkvrzh9k.jpg',
                    filename: 'CarGO/oodxnztjtdefqkvrzh9k'
                },
                {
                    url: 'https://res.cloudinary.com/dgviuwbga/image/upload/v1616288871/CarGO/ahaecrlphsyje7rjsz33.jpg',
                    filename: 'CarGO/ahaecrlphsyje7rjsz33'
                }
            ],
            description: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form."
        })
        await randomCargo.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});

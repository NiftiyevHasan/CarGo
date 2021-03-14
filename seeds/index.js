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
            author: '604be7de75ced91c66e126dc',
            location: `${cities[random100 * 10].city}`,
            destination: `${cities[(random100 * 10 + 150) % 1000].city}`,
            geometry: { 
                type: 'Point', 
                coordinates: [ 49.83518, 40.36666 ] },
            images: [
                {
                    url: 'https://res.cloudinary.com/dgviuwbga/image/upload/v1615736103/CarGO/nfbnkmregln1jnxcaizu.jpg',
                    filename: 'CarGO/nfbnkmregln1jnxcaizu'
                },
                {
                    url: 'https://res.cloudinary.com/dgviuwbga/image/upload/v1615736103/CarGO/bekbqyp4lmotwesexwtw.jpg',
                    filename: 'CarGO/bekbqyp4lmotwesexwtw'
                },
                {
                    url: 'https://res.cloudinary.com/dgviuwbga/image/upload/v1615736103/CarGO/dgmvebjmkwkubyw8nrgc.jpg',
                    filename: 'CarGO/dgmvebjmkwkubyw8nrgc'
                },
                {
                    url: 'https://res.cloudinary.com/dgviuwbga/image/upload/v1615736103/CarGO/mtn6mvdumshvor7bsbvd.jpg',
                    filename: 'CarGO/mtn6mvdumshvor7bsbvd'
                }
            ],
            description: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. "
        })
        await randomCargo.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});

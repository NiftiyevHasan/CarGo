const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CargoSchema = new schema({
    title: String,
    weight: Number,
    location: String,
    destination: String,
    description: String
})

module.exports = mongoose.model('Cargo', CargoSchema);
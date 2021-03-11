const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CargoSchema = new Schema({
    type: String,
    image: String,
    weight: Number,
    location: String,
    destination: String,
    description: String,
    bids: [
        {
            type: Schema.Types.ObjectId,
            ref: "Bid"
        }
    ]
})

module.exports = mongoose.model('Cargo', CargoSchema);
const mongoose = require('mongoose');
const Bid = require('./bid');
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

CargoSchema.post('findOneAndDelete', async function (deletedCargoData) {
    if (deletedCargoData) {
        await Bid.deleteMany({
            _id: {
                $in: deletedCargoData.bids
            }
        })
    }
})

module.exports = mongoose.model('Cargo', CargoSchema);
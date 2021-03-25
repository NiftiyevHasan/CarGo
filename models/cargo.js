const mongoose = require('mongoose');
const Bid = require('./bid');
const user = require('./user');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');



const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const opts = { toJSON: { virtuals: true } };


const CargoSchema = new Schema({
    type: String,
    images: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    weight: Number,
    location: String,
    destination: String,
    description: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    bids: [
        {
            type: Schema.Types.ObjectId,
            ref: "Bid"
        }
    ]
},opts);

CargoSchema.virtual('properties.popUpMarkup').get(function () {
    return `<strong><a href="/cargopanel/${this._id}">${this.type}</a></strong>
    <p> To : ${this.destination}...</p>`
});


CargoSchema.post('findOneAndDelete', async function (deletedCargoData) {
    if (deletedCargoData) {
        await Bid.deleteMany({
            _id: {
                $in: deletedCargoData.bids
            }
        })
    }
})

CargoSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Cargo', CargoSchema);


const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bidSchema = new Schema({
    amount: Number,
    status: String,
    message: String,

})

module.exports = mongoose.model('Bid', bidSchema);
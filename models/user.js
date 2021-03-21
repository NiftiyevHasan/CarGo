const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');


const UserSchema = new Schema({
    rating: {
    type: Number,
},
    firstname: {
        type: String,
        required: true
},
    lastname: {
        type: String,
        required: true
},
    role: {
        type: String,
        required: true
},
    email: {
        type: String,
        required: true,
        unique: true
    },

});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
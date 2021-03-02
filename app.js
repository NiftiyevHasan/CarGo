const express = require('express');
const path = require('path');

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


const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.get('/', (request, response) => {
	response.render('home');
})

app.listen(3000, () => {
	console.log('~~~~~~~~ LISTENING ON PORT 3000! ~~~~~~~~');
})
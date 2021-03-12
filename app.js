const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const { cargoSchema, bidSchema } = require('./schemas.js');
const methodOverride = require('method-override');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressErrors');
const Cargo = require('./models/cargo');
const Bid = require('./models/bid');
const cargos = require('./routes/cargos');
const bids = require('./routes/bids');

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

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use('/cargopanel', cargos);
app.use('/cargopanel/:id/bids', bids);



const validateBid = (request, respond, next) => {
	const { error } = bidSchema.validate(request.body);
	if (error) {
		const message = error.details.map(el => el.message).join(',')
		throw new ExpressError(message, 404)
	} else {
		next()
	}
}

app.get('/', (request, response) => {
	response.render('home');
})


app.post('/cargopanel/:id/bids', validateBid, catchAsync(async (request, response) => {
	const cargo = await Cargo.findById(request.params.id);
	const bid = new Bid(request.body.bid);
	cargo.bids.push(bid);
	await bid.save();
	await cargo.save();
	response.redirect(`/cargopanel/${cargo._id}`)
}))



app.delete('/cargopanel/:id/bids/:bidId', catchAsync(async (request, response) => {
	const { id, bidId } = request.params;
	await Cargo.findByIdAndUpdate(id, { $pull: { bids: bidId } })
	await Bid.findByIdAndDelete(bidId);
	response.redirect(`/cargopanel/${id}`);
}))


app.all('*', (request, response, next) => {
	next(new ExpressError('Page Not Found', 404));
})

app.use((error, request, response, next) => {
	const { statusCode = 500 } = error;
	if (!error.message) error.message = 'Ooops Something went wrong!'
	response.status(statusCode).render('error', { error });
})
app.listen(3000, () => {
	console.log('~~~~~~~~ LISTENING ON PORT 3000! ~~~~~~~~');
})

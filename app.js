const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const { cargoSchema } = require('./schemas.js');
const methodOverride = require('method-override');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressErrors');
const Cargo = require('./models/cargo');

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

const validateCargo = (request, respond, next) => {
	const { error } = cargoSchema.validate(request.body);
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

app.get('/cargopanel', catchAsync(async (request, response) => {
	const cargos = await Cargo.find({});
	response.render('cargos/index', { cargos })
}))

app.post('/cargopanel', validateCargo, catchAsync(async (request, response) => {
	const cargo = new Cargo(request.body.cargo);
	await cargo.save();
	response.redirect(`/cargopanel/${cargo._id}`)
}))

app.get('/cargopanel/new', (request, response) => {
	response.render('cargos/new');
})

app.get('/cargopanel/:id/edit', catchAsync(async (request, response) => {
	const cargo = await Cargo.findById(request.params.id);
	response.render('cargos/edit', { cargo });
}))

app.get('/cargopanel/:id', catchAsync(async (request, response) => {
	const cargo = await Cargo.findById(request.params.id);
	response.render("cargos/show", { cargo });
}))

app.put('/cargopanel/:id', validateCargo, catchAsync(async (request, response) => {
	const cargo = await Cargo.findByIdAndUpdate(request.params.id, { ...request.body.cargo });
	response.redirect(`/cargopanel/${cargo._id}`);
}))

app.delete('/cargopanel/:id', catchAsync(async (request, response) => {
	await Cargo.findByIdAndDelete(request.params.id);
	response.redirect('/cargopanel');
}))

app.all('*', (request, response) => {
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

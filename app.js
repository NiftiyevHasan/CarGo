const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Cargo = require('./models/cargo');
const { response } = require('express');


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

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.get('/', (request, response) => {
	response.render('home');
})

app.get('/cargopanel', async (request, response) => {
	const cargos = await Cargo.find({});
	response.render('cargos/index', { cargos })
})

app.post('/cargopanel', async (request, response) => {
	const cargo = new Cargo(request.body.cargo);
	await cargo.save();
	response.redirect(`/cargopanel/${cargo._id}`)
})

app.get('/cargopanel/new', (request, response) => {
	response.render('cargos/new');
})

app.get('/cargopanel/:id/edit', async (request, response) => {
	const cargo = await Cargo.findById(request.params.id);
	response.render('cargos/edit', { cargo });
})

app.get('/cargopanel/:id', async (request, response) => {
	const cargo = await Cargo.findById(request.params.id);
	response.render("cargos/show", { cargo });
})

app.put('/cargopanel/:id', async (request, response) => {
	const cargo = await Cargo.findByIdAndUpdate(request.params.id, { ...request.body.cargo });
	response.redirect(`/cargopanel/${cargo._id}`);
})

app.delete('/cargopanel/:id', async (request, response) => {
	await Cargo.findByIdAndDelete(request.params.id);
	response.redirect('/cargopanel');
})


app.listen(3000, () => {
	console.log('~~~~~~~~ LISTENING ON PORT 3000! ~~~~~~~~');
})

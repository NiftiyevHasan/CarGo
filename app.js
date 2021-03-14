if (process.env.NODE_ENV !== "production") {
	require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressErrors');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const usersRoute = require('./routes/users')
const cargosRoute = require('./routes/cargos');
const bidsRoute = require('./routes/bids');

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

const sessionConfig = {
	secret: 'thisismybigsecret',
	resave: false,
	saveUninitialized: true,
	cookie: {
		expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
		maxAge: 1000 * 60 * 60 * 24 * 7,
		HttpOnly: true
	}

}

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


app.use((request, response, next) => {
	response.locals.currentUser = request.user;
	response.locals.success = request.flash('success');
	response.locals.error = request.flash('error');
	next();
})


app.use('/', usersRoute);
app.use('/cargopanel', cargosRoute);
app.use('/cargopanel/:id/bids', bidsRoute);



app.get('/', (request, response) => {
	response.render('home');
})



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

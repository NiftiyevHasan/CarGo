const User = require('../models/user')
const Cargo = require('../models/cargo')
const Bid = require('../models/bid');
const { request } = require('express');

module.exports.renderRegisterForm = (request, response) => {
    response.render('users/register');
}

module.exports.register = async (request, response, next) => {
    try {
        const { username, password, email, role } = request.body;
        const user = new User({ username, email, role});
        const registeredUser = await User.register(user, password);
        request.login(registeredUser, error => {
            if (error) return next(error);
            request.flash('success', 'Welcome to CarGo')
            response.redirect('/cargopanel');
        })
    } catch (error) {
        request.flash('error', error.message);
        response.redirect('register');
    }

}

module.exports.renderLoginForm = (request, response) => {
    response.render('users/login');
}

module.exports.login = async (request, response) => {
    request.flash('success', `Welcome back, ${request.body.username}`);
    const redirectUrl = request.session.returnTo || '/cargopanel';
    delete request.session.returnTo;
    response.redirect(redirectUrl);
}

module.exports.logout = (request, response) => {
    request.logOut();
    // request.session.destroy();
    request.flash('success', 'Goodbye, looking forward to see you again!')
    response.redirect('/cargopanel');
}

module.exports.renderDashboard = async (request,response) => {
 const cargos = await Cargo.find({'author' : request.user._id});
 const bids = await Bid.find({'author' : request.user._id});
    response.render('users/dashboard', { cargos, bids });
}

module.exports.renderDriverProfile = async (request,response) => {
    response.render('users/driverprofile')
}
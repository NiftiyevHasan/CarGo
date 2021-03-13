const User = require('../models/user')
const passport = require('passport');


module.exports.renderRegisterForm = (request, response) => {
    response.render('users/register');
}

module.exports.register = async (request, response, next) => {
    try {
        const { username, password, email } = request.body;
        const user = new User({ username, email });
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
    const redirectlUrl = request.session.returnTo || '/cargopanel';
    delete request.session.returnTo;
    response.redirect(redirectlUrl);
}

module.exports.logout = (request, response) => {
    request.logOut();
    request.flash('success', 'Goodbye, looking forward to see you again!')
    response.redirect('/cargopanel');
}
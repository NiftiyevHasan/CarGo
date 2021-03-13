const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user')
const catchAsync = require('../utils/catchAsync');

router.get('/register', (request, response) => {
    response.render('users/register');
})

router.post('/register', catchAsync((async (request, response, next) => {
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

})))

router.get('/login', (request, response) => {
    response.render('users/login');
})

router.post('/login', passport.authenticate('local', {
    failureFlash: true,
    FailureRedirect: '/login'
}), async (request, response) => {
    request.flash('success', `Welcome back, ${request.body.username}`);
    const redirectlUrl = request.session.returnTo || '/cargopanel';
    delete request.session.returnTo;
    response.redirect(redirectlUrl);
})

router.get('/logout', (request, response) => {
    request.logOut();
    request.flash('success', 'Goodbye, looking forward to see you again!')
    response.redirect('/cargopanel');
})


module.exports = router;

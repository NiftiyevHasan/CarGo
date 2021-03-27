const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const users = require('../controllers/users');
const { isLoggedIn } = require('../middlewares');

router.route('/register')
    .get(users.renderRegisterForm)
    .post(catchAsync(users.register))

router.route('/login')
    .get(users.renderLoginForm)
    .post(passport.authenticate('local', {
        failureFlash: true,
        FailureRedirect: '/login'
    }), users.login)

router.get('/logout', users.logout)

router.get('/profile', isLoggedIn, users.renderDashboard)
router.get('/profile/:username', isLoggedIn, users.renderDriverProfile)

router.get('/forgot', users.renderForgotForm)
router.post('/forgot', users.handleForgot)

router.get('/reset/:token', users.renderReset)
router.post('/reset/:token', users.handleReset)


module.exports = router;

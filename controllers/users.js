const User = require('../models/user')
const Cargo = require('../models/cargo')
const Bid = require('../models/bid');
const async = require('async');
const nodemailer = require("nodemailer");
const crypto = require("crypto");


module.exports.renderRegisterForm = (request, response) => {
    response.render('users/register');
}

module.exports.register = async (request, response, next) => {
    try {
        const { username, password, email, role, firstname, lastname, rating = 4.5 } = request.body;
        const user = new User({ username, email, role, firstname, lastname, rating });
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

module.exports.renderDashboard = async (request, response) => {
    const cargos = await Cargo.find({ 'author': request.user._id });
    const bids = await Bid.find({ 'author': request.user._id });
    response.render('users/dashboard', { cargos, bids });
}

module.exports.renderDriverProfile = async (request, response) => {
    const user = await User.findOne({ username: request.params.username })
    response.render('users/driverprofile', { user });
}

module.exports.renderForgotForm = (request, response) => {
    response.render('users/forgot')
}

module.exports.handleForgot = async (request, response, next) => {
    async.waterfall([
        function (done) {
            crypto.randomBytes(20, function (err, buf) {
                const token = buf.toString('hex');
                done(err, token);
            });
        },
        function (token, done) {
            User.findOne({ email: request.body.email }, function (err, user) {
                if (!user) {
                    request.flash('error', 'No account with that email address exists.');
                    return response.redirect('/forgot');
                }

                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 1000 * 60 * 60; // 1 hour

                user.save(function (err) {
                    done(err, token, user);
                });
            });
        },
        function (token, user, done) {
            const smtpTransport = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'cargoapp2021@gmail.com',
                    pass: process.env.GMAIL_PASSWORD
                }
            });
            const mailOptions = {
                to: user.email,
                from: 'info@cargoapp.com',
                subject: 'Requested Password Reset',
                text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                    'http://' + request.headers.host + '/reset/' + token + '\n\n' + 
                    'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            };
            smtpTransport.sendMail(mailOptions, function (err) {
                request.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
                done(err, 'done');
            });
        }
    ], function (err) {
        if (err) return next(err);
        response.redirect('/forgot');
    });
}


module.exports.renderReset = (request, response) => {
    const {token} = request.params;
    User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
        if (!user) {
            request.flash('error', 'Password reset token is invalid or has expired.');
            return response.redirect('/forgot');
        }
        response.render('users/reset', {token});
    });
}

module.exports.handleReset = async (request, response) => {
    async.waterfall([
        function (done) {
            User.findOne({ resetPasswordToken: request.params.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
                if (!user) {
                    request.flash('error', 'Password reset token is invalid or has expired.');
                    return response.redirect('back');
                }

                if (request.body.password === request.body.confirm) {
                    user.setPassword(request.body.password, function (err) {
                        user.resetPasswordToken = undefined;
                        user.resetPasswordExpires = undefined;

                        user.save(function (err) {
                            request.logIn(user, function (err) {
                                done(err, user);
                            });
                        });
                    })
                } else {
                    req.flash("error", "Passwords do not match.");
                    return response.redirect('back');
                }
            });
        },
        function (user, done) {
            const smtpTransport = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'cargoapp2021@gmail.com',
                    pass: process.env.GMAIL_PASSWORD
                }
            });
            const mailOptions = {
                to: user.email,
                from: 'passwordreset@cargoapp.com',
                subject: 'Your password has been changed',
                text: 'Hello,\n\n' +
                    'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
            };
            smtpTransport.sendMail(mailOptions, function (err) {
                request.flash('success', 'Success! Your password has been changed.');
                done(err);
            });
        }
    ], function (err) {
        response.redirect('/cargopanel');
    });
}

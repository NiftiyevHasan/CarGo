module.exports.isLoggedIn = (request, response, next) => {
    if (!request.isAuthenticated()) {
        request.session.returnTo = request.originalUrl;
        request.flash('error', 'You must be sign in to proceed this page');
        return response.redirect('/login');
    }
    next();
}
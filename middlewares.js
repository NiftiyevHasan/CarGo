const { cargoSchema, bidSchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressErrors');
const Cargo = require('./models/cargo');
const Bid = require('./models/bid');


module.exports.isLoggedIn = (request, response, next) => {
    if (!request.isAuthenticated()) {
        request.session.returnTo = request.originalUrl;
        request.flash('error', 'You must be sign in to proceed this page');
        return response.redirect('/login');
    }
    next();
}

module.exports.validateCargo = (request, respond, next) => {
    const { error } = cargoSchema.validate(request.body);
    if (error) {
        const message = error.details.map(el => el.message).join(',')
        throw new ExpressError(message, 404)
    } else {
        next()
    }
}

module.exports.isAuthor = async (request, response, next) => {
    const cargo = await Cargo.findById(request.params.id);
    if (!cargo.author.equals(request.user._id)) {
        request.flash('error', 'You dont have permission to perform specified action');
        return response.redirect(`/cargopanel/${request.params.id}`);
    }
    next();
}

module.exports.isBidAuthor = async (request, response, next) => {
    const { id, bidId } = request.params;
    const bid = await Bid.findById(bidId);
    if (!bid.author.equals(request.user._id)) {
        request.flash('error', 'You dont have permission to perform specified action');
        return response.redirect(`/cargopanel/${id}`);
    }
    next();
}
module.exports.validateBid = (request, respond, next) => {
    const { error } = bidSchema.validate(request.body);
    if (error) {
        const message = error.details.map(el => el.message).join(',')
        throw new ExpressError(message, 404)
    } else {
        next()
    }
}
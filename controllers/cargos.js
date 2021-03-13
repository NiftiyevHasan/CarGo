const Cargo = require('../models/cargo');


module.exports.index = async (request, response) => {
    const cargos = await Cargo.find({});
    response.render('cargos/index', { cargos })
}

module.exports.renderNewCargoForm = (request, response) => {
    response.render('cargos/new');
}

module.exports.createNewCargo = async (request, response) => {
    const cargo = new Cargo(request.body.cargo);
    cargo.author = request.user._id;
    await cargo.save();
    request.flash('success', 'Successfully created new cargo request');
    response.redirect(`/cargopanel/${cargo._id}`)
}

module.exports.showCargo = async (request, response) => {
    const cargo = await (await Cargo.findById(request.params.id).populate({
        path: 'bids',
        populate: {
            path: 'author'
        }
    }).populate('author'));
    if (!cargo) {
        request.flash('error', 'Can not find requested cargo');
        return response.redirect('/cargopanel');
    }
    response.render("cargos/show", { cargo });
}

module.exports.renderEditCargoForm = async (request, response) => {
    const cargo = await Cargo.findById(request.params.id);
    if (!cargo) {
        request.flash('error', 'Can not find requested cargo');
        return response.redirect('/cargopanel');
    }
    response.render('cargos/edit', { cargo });
}

module.exports.updateCargo = async (request, response) => {
    const cargo = await Cargo.findByIdAndUpdate(request.params.id, { ...request.body.cargo });
    request.flash('success', 'Successfully updated cargo details');
    response.redirect(`/cargopanel/${cargo._id}`);
}

module.exports.deleteCargo = async (request, response) => {
    await Cargo.findByIdAndDelete(request.params.id);
    request.flash('success', 'Successfully deleted cargo');
    response.redirect('/cargopanel');
}
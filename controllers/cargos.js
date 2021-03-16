const Cargo = require('../models/cargo');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require('../cloudinary')

module.exports.index = async (request, response) => {
    const cargos = await Cargo.find({});
    response.render('cargos/index', { cargos })
}

module.exports.renderNewCargoForm = (request, response) => {
    response.render('cargos/new');
}

module.exports.createNewCargo = async (request, response) => {
    const geoData = await geocoder.forwardGeocode({
        query: request.body.cargo.location,
        limit: 1
    }).send()
    const cargo = new Cargo(request.body.cargo);
    cargo.geometry = geoData.body.features[0].geometry;
    cargo.images = request.files.map(file => ({ url: file.path, filename: file.filename }));
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
    response.render('cargos/edit', { cargo });
}

module.exports.updateCargo = async (request, response) => {
    const cargo = await Cargo.findByIdAndUpdate(request.params.id, { ...request.body.cargo });
    const images = request.files.map(file => ({ url: file.path, filename: file.filename }));
    cargo.images.push(...images);
    await cargo.save();
    if (request.body.deleteImages) {
        for (let filename of request.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await cargo.updateOne({ $pull: { images: { filename: { $in: request.body.deleteImages } } } })
    }
    request.flash('success', 'Successfully updated cargo details');
    response.redirect(`/cargopanel/${cargo._id}`);
}

module.exports.deleteCargo = async (request, response) => {
    await Cargo.findByIdAndDelete(request.params.id);
    request.flash('success', 'Successfully deleted cargo');
    response.redirect('/cargopanel');
}
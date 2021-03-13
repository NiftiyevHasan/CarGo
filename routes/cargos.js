const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Cargo = require('../models/cargo');
const { isLoggedIn, isAuthor, validateCargo } = require('../middlewares');


router.get('/', catchAsync(async (request, response) => {
    const cargos = await Cargo.find({});
    response.render('cargos/index', { cargos })
}))

router.post('/', isLoggedIn, validateCargo, catchAsync(async (request, response) => {
    const cargo = new Cargo(request.body.cargo);
    cargo.author = request.user._id;
    await cargo.save();
    request.flash('success', 'Successfully created new cargo request');
    response.redirect(`/cargopanel/${cargo._id}`)
}))

router.get('/new', (request, response) => {
    response.render('cargos/new');
})

router.get('/:id', catchAsync(async (request, response) => {
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
}))


router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (request, response) => {
    const cargo = await Cargo.findById(request.params.id);
    if (!cargo) {
        request.flash('error', 'Can not find requested cargo');
        return response.redirect('/cargopanel');
    }
    response.render('cargos/edit', { cargo });
}))


router.put('/:id', isLoggedIn, isAuthor, validateCargo, catchAsync(async (request, response) => {
    const cargo = await Cargo.findByIdAndUpdate(request.params.id, { ...request.body.cargo });
    request.flash('success', 'Successfully updated cargo details');
    response.redirect(`/cargopanel/${cargo._id}`);
}))

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (request, response) => {
    await Cargo.findByIdAndDelete(request.params.id);
    request.flash('success', 'Successfully deleted cargo');
    response.redirect('/cargopanel');
}))

module.exports = router;
const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressErrors');
const Cargo = require('../models/cargo');
const { cargoSchema } = require('../schemas.js');

const validateCargo = (request, respond, next) => {
    const { error } = cargoSchema.validate(request.body);
    if (error) {
        const message = error.details.map(el => el.message).join(',')
        throw new ExpressError(message, 404)
    } else {
        next()
    }
}


router.get('/', catchAsync(async (request, response) => {
    const cargos = await Cargo.find({});
    response.render('cargos/index', { cargos })
}))

router.post('/', validateCargo, catchAsync(async (request, response) => {
    const cargo = new Cargo(request.body.cargo);
    await cargo.save();
    response.redirect(`/cargopanel/${cargo._id}`)
}))

router.get('/new', (request, response) => {
    response.render('cargos/new');
})

router.get('/:id/edit', catchAsync(async (request, response) => {
    const cargo = await Cargo.findById(request.params.id);
    response.render('cargos/edit', { cargo });
}))

router.get('/:id', catchAsync(async (request, response) => {
    const cargo = await Cargo.findById(request.params.id).populate('bids');
    response.render("cargos/show", { cargo });
}))

router.put('/:id', validateCargo, catchAsync(async (request, response) => {
    const cargo = await Cargo.findByIdAndUpdate(request.params.id, { ...request.body.cargo });
    response.redirect(`/cargopanel/${cargo._id}`);
}))

router.delete('/:id', catchAsync(async (request, response) => {
    await Cargo.findByIdAndDelete(request.params.id);
    response.redirect('/cargopanel');
}))

module.exports = router;
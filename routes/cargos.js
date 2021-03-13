const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Cargo = require('../models/cargo');
const cargos = require('../controllers/cargos');
const { isLoggedIn, isAuthor, validateCargo } = require('../middlewares');


router.route('/')
    .get(catchAsync(cargos.index))
    .post(isLoggedIn, validateCargo, catchAsync(cargos.createNewCargo))

router.get('/new', isLoggedIn, cargos.renderNewCargoForm)

router.route('/:id')
    .get(catchAsync(cargos.showCargo))
    .put(isLoggedIn, isAuthor, validateCargo, catchAsync(cargos.updateCargo))
    .delete(isLoggedIn, isAuthor, catchAsync(cargos.deleteCargo))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(cargos.renderEditCargoForm))


module.exports = router;
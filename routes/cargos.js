const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Cargo = require('../models/cargo');
const cargos = require('../controllers/cargos');
const { isLoggedIn, isAuthor, validateCargo } = require('../middlewares');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.route('/')
    .get(catchAsync(cargos.index))
    .post(isLoggedIn, upload.array('image'), validateCargo, catchAsync(cargos.createNewCargo))

router.get('/new', isLoggedIn, cargos.renderNewCargoForm)

router.route('/:id')
    .get(catchAsync(cargos.showCargo))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCargo, catchAsync(cargos.updateCargo))
    .delete(isLoggedIn, isAuthor, catchAsync(cargos.deleteCargo))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(cargos.renderEditCargoForm))


module.exports = router;
const express = require('express');
const router = express.Router({ mergeParams: true });
const ExpressError = require('../utils/ExpressErrors');
const bids = require('../controllers/bids');
const catchAsync = require('../utils/catchAsync');
const { validateBid, isBidAuthor, isLoggedIn } = require('../middlewares');



router.route('/')
        .post(validateBid, isLoggedIn, catchAsync(bids.createBid))

router.route('/:bidId')
        .delete(isLoggedIn, isBidAuthor, catchAsync(bids.deleteBid))
        .get(isLoggedIn, catchAsync(bids.renderUpdateBid))

module.exports = router;
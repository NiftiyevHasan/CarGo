const express = require('express');
const router = express.Router({ mergeParams: true });
const ExpressError = require('../utils/ExpressErrors');
const bids = require('../controllers/bids');
const catchAsync = require('../utils/catchAsync');
const { validateBid, isBidAuthor, isLoggedIn } = require('../middlewares');



router.post('/', validateBid, isLoggedIn, catchAsync(bids.createBid))

router.delete('/:bidId', isLoggedIn, isBidAuthor, catchAsync(bids.deleteBid))

module.exports = router;
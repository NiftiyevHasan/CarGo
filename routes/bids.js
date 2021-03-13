const express = require('express');
const router = express.Router({ mergeParams: true });
const ExpressError = require('../utils/ExpressErrors');
const Bid = require('../models/bid');
const Cargo = require('../models/cargo');
const catchAsync = require('../utils/catchAsync');
const { validateBid } = require('../middlewares');




router.post('/', validateBid, catchAsync(async (request, response) => {
    const cargo = await Cargo.findById(request.params.id);
    const bid = new Bid(request.body.bid);
    cargo.bids.push(bid);
    await bid.save();
    await cargo.save();
    request.flash('success', 'Successfully posted a new bid');
    response.redirect(`/cargopanel/${cargo._id}`)
}))



router.delete('/:bidId', catchAsync(async (request, response) => {
    const { id, bidId } = request.params;
    await Cargo.findByIdAndUpdate(id, { $pull: { bids: bidId } })
    await Bid.findByIdAndDelete(bidId);
    request.flash('success', 'Successfully deleted offered bid');
    response.redirect(`/cargopanel/${id}`);
}))

module.exports = router;
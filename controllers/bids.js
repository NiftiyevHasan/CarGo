const Bid = require('../models/bid');
const Cargo = require('../models/cargo');

module.exports.createBid = async (request, response) => {
    const cargo = await Cargo.findById(request.params.id);
    const bid = new Bid(request.body.bid);
    bid.author = request.user._id;
    cargo.bids.push(bid);
    await bid.save();
    await cargo.save();
    request.flash('success', 'Successfully posted a new bid');
    response.redirect(`/cargopanel/${cargo._id}`)
}

module.exports.deleteBid = async (request, response) => {
    const { id, bidId } = request.params;
    await Cargo.findByIdAndUpdate(id, { $pull: { bids: bidId } })
    await Bid.findByIdAndDelete(bidId);
    request.flash('success', 'Successfully deleted offered bid');
    response.redirect(`/cargopanel/${id}`);
}
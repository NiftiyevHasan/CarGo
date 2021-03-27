const Bid = require('../models/bid');
const Cargo = require('../models/cargo');

module.exports.createBid = async (request, response) => {
    const cargo = await Cargo.findById(request.params.id);
    const bid = new Bid(request.body.bid);
    bid.author = request.user._id;
    bid.status = 'pending';
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


module.exports.renderUpdateBid = async (request,response) => {
    const { id, bidId } = request.params;
    const cargo = await (await Cargo.findById(id).populate({
        path: 'bids',
        populate: {
            path: 'author'
        }
    }).populate('author'));

    response.render("bids/updateBidsForm.ejs",{cargo, bidId });

}

module.exports.updateBid = async(request,response) => {
    const cargo = await Cargo.findById(request.params.id);
    await Bid.findByIdAndUpdate(request.params.bidId, {...request.body.bid});
    response.redirect(`/cargopanel/${cargo._id}`)
}

module.exports.redirectFromLoginToBid = (request,response) => {
    request.flash('success', 'Please re-submit your offer again.');
    response.redirect(`/cargopanel/${request.params.id}`);
}
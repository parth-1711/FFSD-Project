const mongoose = require ('mongoose')

const offerSchema = {
    offerer: String,
    productName: String,
    owner: String,
    amount: Number,
    offerStatus: {
        type: Number,
        default: 0
    }
}

const Offer = mongoose.model("Offer", offerSchema);
module.exports =  Offer;

const mongoose = require ('mongoose')

const productSchema = {
    images: String,
    title: String,
    description: String,
    howold: String,
    setprice: Number,
    address: String,
    images: String,
    owner: String,
    offersreceived: []
}

const Product = mongoose.model("Product", productSchema);

module.exports =   Product;
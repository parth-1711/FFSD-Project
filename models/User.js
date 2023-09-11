const mongoose = require ('mongoose')
const offerSchema = require("./Offer")

const userSchema = {
    uname: String,
    email: String,
    password: String,
    adress: [String],
    offers: [offerSchema]
};

const User = mongoose.model("User", userSchema);
module.exports =  User;


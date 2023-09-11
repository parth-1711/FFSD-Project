const mongoose = require ('mongoose')
const adminSchema = {
    aname: String,
    email: String,
    password: String,
}

const Admin = mongoose.model("Admin", adminSchema);

module.exports =   Admin;
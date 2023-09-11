const mongoose = require ('mongoose')

const querySchema = {
    querrier: String,
    query: String
}

const Query = mongoose.model("Query", querySchema);

module.exports =   Query;
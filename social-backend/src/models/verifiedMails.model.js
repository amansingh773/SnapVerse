const mongoose = require("mongoose")

const vmSchema = new mongoose.Schema({
    email : {
        type : String,
        required : true,
        unique : true
    }
})

const VerifiedMail = mongoose.model("verifiedMail", vmSchema)
module.exports = {
    VerifiedMail
}
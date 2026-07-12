const mongoose = require("mongoose")

const otpSchema = new mongoose.Schema({
    otp : {
        type : Number,
        required : true
    },
    email : {
        type : String,
        required : true,
        // unique : true
    },
    expireAt : {
        type : Date,
        expires : 120,
        default : Date.now
    }
}, {
    timestamps : true
})

const OTP = mongoose.model("OTP", otpSchema)
module.exports = {
    OTP
}
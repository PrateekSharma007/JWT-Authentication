const mongoose = require("mongoose")


const Otpverification = mongoose.Schema({
    userId : String,
    otp : String,
    createdat : Date,
    expiresat : Date 

})

module.exports = mongoose.model("userotp",Otpverification);


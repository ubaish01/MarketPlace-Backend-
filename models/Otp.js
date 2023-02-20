const mongoose = require("mongoose");

const OtpSchema = new mongoose.Schema({
    otp:{type:String,required:true},
    user:{type:String,required:true},
    expireOn:{type:String,required:true},
    isExpired:{type:Boolean,default:false}
})

module.exports = mongoose.model("Otp",OtpSchema);
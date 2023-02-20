const mongoose = require("mongoose");

const BuyerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: Number, required: true, unique: true },
    password: { type: String, required: true },
    city: { type: String, required: true },
    dp: { type: String, required: true },
    isSeller: { type: Boolean, default:false },
    requestedCallback:{type:Array},
    isVerified:{type:Boolean,default:false}

  },
  { timestamps: true }
);

module.exports = mongoose.model("Buyer", BuyerSchema);
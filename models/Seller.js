const mongoose = require("mongoose");

const SellerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: Number, required: true, unique: true },
    password: { type: String, required: true },
    city: { type: String, required: true },
    address: { type: String, required: true },
    description: { type: String, required: true },
    openingTime: { type: String, required: true },
    closingTime: { type: String, required: true },
    sellerRating: { type: Array,default:[1]},
    dp: { type: String ,default:"https://www.freeiconspng.com/thumbs/profile-icon-png/am-a-19-year-old-multimedia-artist-student-from-manila--21.png" },
    products: { type: Array },
    isSeller: { type: Boolean, required: true},
    requestedCallback:{type:Array},
    isVerified:{type:Boolean,default:false}

  },
  { timestamps: true }
);

module.exports = mongoose.model("Seller", SellerSchema);
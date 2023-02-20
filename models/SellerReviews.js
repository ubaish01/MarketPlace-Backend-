const mongoose = require("mongoose");

const SellerReviewsSchema = new mongoose.Schema(
  {
    seller_id:{type:String, required:true},
    reviewer_name: { type: String, required: true },
    one_liner: { type: String, required: true, },
    reviewer_dp: { type: String, required: true},
    rating: { type: Number, required: true },
    desc: { type: String, required: true },
    purchased_products: { type: Array, required: true },
    item_image : {type:String}
  },
  { timestamps: true }
);

module.exports = mongoose.model("SellerReviews", SellerReviewsSchema);
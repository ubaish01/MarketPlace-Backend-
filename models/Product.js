const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true, },
    color: { type: Array, required: true},
    size: { type: Array, required: true },
    price: { type: Number, required: true },
    photos: { type: Array, required: true },
    seller_id: { type: String, required: true },
    seller_name: { type: String, required: true },
    weight: { type: String},
    replacement: { type: String },
    ratings: { type: Array},
    city: { type: String,required:true}

  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
const Product = require("../models/Product");
const Seller = require("../models/Seller");
const router = require('express').Router();
// const router = require("./");
const {
  verifyToken,
  verifyTokenAndSeller,
} = require("./verifyToken");


//CREATE

router.post("/create", verifyTokenAndSeller, async (req, res) => {
  const { seller_id } = req.body
  console.log(req.body);
  const newProduct = new Product(req.body);

  try {
    const savedProduct = await newProduct.save();

    const seller = Seller.findById(seller_id);

    await seller.updateOne({ $push: { products: savedProduct._id } });

    res.status(200).json({message:"Product creation succeed",savedProduct});
  } catch (err) {
    console.log(err.message)
    res.status(500).json(err);
  }
});


// UPDATE
// router.put("/:id",verifyTokenAndSeller,async(req,res)=>{
//     try{
//         const updatedProduct = await Product.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true});
//         res.status(200).json({message:"Order updation succeed ",updatedProduct});
//     }
//     catch(err){
//         res.status(500).json({error:err.message});
//     }})


// // DELETE
// router.delete("/:id",verifyTokenAndSeller,async(req,res)=>{
//        try{
//         await Product.findByIdAndDelete(req.params.id);
//         res.status(200).json({message:"Product has been deleted successfully "});
//     }
//     catch(err){
//         res.status(500).json({error:err.message});

//     }})



// // GET ALL 
router.get("/shop", verifyToken, async (req, res) => {
  var id = undefined
  var category = undefined;
  console.log(req.query)
  if (req.query.id!=='null') {
    id = req.query.id;
  }
  else if (req.query.category!='null') {
    category = req.query.category;
  }

  try {
    var response = undefined;

    if (id) {
      response = await Product.find({ seller_id: req.query.id,city:req.query.city })
      console.log("I am if")
    }
    else if (category) {
      response = await Product.find({ category: category,city:req.query.city })
      console.log("I am elseif")
    }
    else {
      console.log("I am else")
      response = await Product.find({city: req.query.city});

    }

    if (response) {
      res.status(200).json(response);
    }
    else {
      res.status(500).json("Something went wrong");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// // GET SINGLE PRODUCT 
router.get("/:id", verifyToken, async (req, res) => {
  console.log("I am here");

  try {
    const response = await Product.findById(req.params.id);

    if (!response.$isEmpty()) {
      res.status(200).json(response);
    }
    else {
      res.status(500).json("Something went wrong");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});




module.exports = router
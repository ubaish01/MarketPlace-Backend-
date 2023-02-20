const Buyer = require("../models/Buyer");
const Seller = require("../models/Seller");
const router = require('express').Router();
const jwt = require("jsonwebtoken");

const {
    verifyToken,
    verifyTokenAndSeller,
} = require("./verifyToken");




// UPDATE
router.put("/update", verifyToken, async (req, res) => {
    const { id, password, ...other } = req.body
    var success = false;
    if (other.isSeller) {
        const foundUser = await Seller.findByIdAndUpdate(id, other, (err, response) => {
            if (err) {
                console.log(err);
                success = false;
            }
            else {
                success = true;
            }
        })
            .clone().catch(function (err) { console.log(err) })
        if (success) {
            const token = req.headers.token.split(" ")[1];
            var response = foundUser._doc;
            response['token'] = token;
            const { password, ...user } = response;
            res.status(200).json({ message: "updation succeed",user});
        }
        else {
            res.status(500).json({ message: "Something went wrong"});
        }

    }
    else {
        const foundUser = await Buyer.findByIdAndUpdate(id, other, (err, response) => {
            if (err) {
                console.log(err);
                success = false;
            }
            else {
                success = true;
            }
        })
            .clone().catch(function (err) { console.log(err) })
        if (success) {

            const token = req.headers.token.split(" ")[1];
            var response = foundUser._doc;
            response['token'] = token;
            const { password, ...user } = response;
            res.status(200).json({ message: "updation succeed",user});
        }
        else {
            res.status(500).json({ message: "Something went wrong"});
        }
    }



})


// // DELETE
// router.delete("/:id",verifyTokenAndAdmin,async(req,res)=>{
//        try{
//         await Order.findByIdAndDelete(req.params.id);
//         res.status(200).json({message:"Order has been deleted successfully "});
//     }
//     catch(err){
//         res.status(500).json({error:err});

//     }})




// // GET ALL 
router.get("/shop", verifyToken, async (req, res) => {
    var id = undefined;
    var category = undefined;
    if (req.query.id) {
        id = req.query.id;
    }
    else if (req.query.category) {
        category = req.query.category;
    }

    try {
        var response = undefined;

        if (id) {
            response = await Product.find({ seller_id: id })
        }
        else if (category) {
            response = await Product.find({ category: category })
        }
        else {

            response = await Product.find({ city: req.body.city });

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

// // GET SINGLE SELLER 
router.get("/seller", verifyToken, async (req, res) => {
    console.log(req.query.id);

    try {
        const user = await Seller.findById(req.query.id);

        const { password, isSeller, ...response } = user._doc;
        res.status(200).json(response);
    } catch (err) {
        res.status(500).json(err);
    }
});


const avgRating = (ratings) => {
    console.log(ratings)
    var sum = 0;
    for(var i=0;i<ratings.length;i++)
    {
        sum+=ratings[i];
    }
    return sum / ratings.length;
}

// GET TOP SELLERS FROM THE CITY (FEATURED SELLERS)
router.get("/shop/featured/:city", verifyToken, async (req, res) => {
    try {        
        const response = await Seller.find({ city: req.params.city });
        const featuredShops = response.sort((a, b) => avgRating(b.sellerRating)-avgRating(a.sellerRating));
        console.log(featuredShops);
        res.status(200).json(featuredShops);
        // res.status(500).json("Something went wrong");

    } catch (err) {
        res.status(500).json(err.message);
    }
});


module.exports = router
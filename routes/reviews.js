const Seller = require('../models/Seller');
const SellerReviews = require('../models/SellerReviews');
const { verifyToken } = require('./verifyToken');

const router = require('express').Router();


router.post("/seller",verifyToken,async(req,res)=>{
    const newSellerReview = new SellerReviews(req.body);
    try{
        newSellerReview.save()
        .then(result=>{
            Seller.findById(req.body.seller_id)
            .then(foundSeller=>{
                foundSeller.updateOne({ $push: { sellerRating: req.body.rating } })
                .then(()=>{
                    console.log("success")
                })
                .catch((errr)=>{
                    console.log(errr.message);
                })
               
            })
            .catch(sellerError=>{
                console.log(sellerError.message);
            })
            
        .catch(err=>{
            console.log(err.message);
        })
        })
       
        res.status(200).json({message:"review posted succesfully"});
    }
    catch(error)
    {
        console.log(error.message);
        res.status(500).json({message:"Fatt gya"});
    }
})


router.get("/seller",verifyToken,async(req,res)=>{
    const sellerId = req.query.seller_id;
    try{
        const allReviews = await SellerReviews.find({seller_id:sellerId})
        res.status(200).json({message:"Fetched all reviews",allReviews});
    }
    catch(error)
    {
        console.log(error.message);
        res.json({message:"Fatt gya"});
    }
})

// 
// router.get("/seller/ratings", verifyToken, async (req, res) => {
//     const sellerId = req.query.seller_id;

//     try {
//         const user = await Seller.findById(sellerId);

//         var sum = 0;
//         user.sellerRating.forEach(element => {
//             sum+=element;
//         });

//         // console.log(user);

//         avg = sum/user.sellerRating.length;

//         res.status(200).json({seller:user,averageRating:avg})

//     } catch (err) {
//         res.status(500).json(err.message);
//     }
// });


module.exports = router
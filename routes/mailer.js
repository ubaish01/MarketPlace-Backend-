const express = require("express");
const router = express.Router();
const nodemailer = require('nodemailer');
const Buyer = require("../models/Buyer");
const Seller = require("../models/Seller");
const Otp = require("../models/Otp");
const { verifyTokenAndSeller, verifyToken } = require("./verifyToken");
const dotenv = require("dotenv");
dotenv.config();


console.log(process.env.EMAIL);
console.log(process.env.EMAIL_PASSWORD);


const generateOTP = () => {
    var digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 6; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
}

const expireDate = () => {
    var currentdate = new Date();
    var datetime = currentdate.getDate() + "/"
        + (currentdate.getMonth() + 1) + "/"
        + currentdate.getFullYear() + " @ "
        + currentdate.getHours() + ":"
        + currentdate.getMinutes() + ":"
        + currentdate.getSeconds();
    console.log(datetime);
    return datetime;
}


const requestCallback = async (address, name, phone, email) => {
    let mailTransporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD
        }
    })

    let details = {
        from: "iamelvin098@gmail.com", // list of receivers
        to: address,
        subject: "Request a callback",
        html: `<h3>Greetings from team marketplace </h3><b>We are happy to see you growing</b><div>Mr/Mrs<b>${name}</b> liked your shop and products and they have made a request for a callback.</div> <div>Give them a call and keep yourself growing with our <b>MarketPlace</b></div><div><b>Here are their contact details</div><div></b><p>Name : <b>${name}</b></p></div><div><p>Phone : <b>${phone}</b></p></div><div><p>Email : <b>${email}</b></p></div><div><p>Kindly give them a try</p></div><p>Thanks and regards team <b>MarketPlace</b></p>`,
    }

    mailTransporter.sendMail(details, (err) => {
        if (err) {
            return console.log("An error occured , ", err);
        }
        else {
            console.log("email sent !");
        }
    })
}

const sendOtp = async (address, otp) => {
    let mailTransporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "iamelvin098@gmail.com",
            pass: "ogpdrxjhjuubumfe "
        }
    })

    let details = {
        from: "iamelvin098@gmail.com", // list of receivers
        to: address,
        subject: "Account Verification",
        html: `<div>Thanks for choosing <b>MarketPlace</b></div><div>Your otp is <b>${otp}</b></div>`,
    }

    mailTransporter.sendMail(details, (err) => {
        if (err) {
            return console.log("An error occured , ", err);
        }
        else {
            console.log("otp sent !");
        }
    })
}



router.put("/", verifyToken, async (req, res) => {
    const { name, phone, email, user_id, seller_id, isSeller } = req.body;
    var user;
    var address;

    Seller.findById(seller_id)
        .then(res => {
            address = res.email;
        })
        .catch(() => {
            console.log("somthing went wrong at line 48")
        })

    if (!isSeller)
        Buyer.findById(user_id)
            .then(data => {
                user = data;
            })
            .catch(error => {
                return console.log(error);
            })
    else
        await Seller.findById(user_id)
            .then(data => {
                user = data;
            })
            .catch(error => {
                return console.log(error);
            })

    if (user.requestedCallback.includes(seller_id)) {
        return res.status(200).json({ error: "You have already requested for a callback", status: "failed" });
    }
    else {

        requestCallback(address, name, phone, email)
            .then(result => {
                user.updateOne({ $push: { requestedCallback: seller_id } })
                    .then(resp => {
                        res.status(200).json({ status: "success", message: "You have requested for a callback The seller will contact you shortly" })
                    })
                    .catch(err => {
                        console.log(err);
                    })

            })
            .catch(err => {
                console.log(err.message);
            })

    }

})



// SEND OTP 
router.post("/otp", (req, res) => {
    const { user_email, user_id } = req.body
    Otp.findOneAndDelete({ user: user_id })
        .then(() => {

            const otp = generateOTP();
            sendOtp(user_email, otp)
                .then(() => {
                    const newOtp = new Otp({
                        otp: otp,
                        user: user_id,
                        expireOn: expireDate()
                    })

                    newOtp.save()
                        .then(() => {
                            res.status(200).json({ message: "Otp sent successfully" })
                        })
                        .catch((error) => {
                            console.log(error.message);
                        })
                })
                .catch(err => {
                    console.log(err);
                })
        })
        .catch(exc => {
            res.status(203).json(exc.message);
        })
})

// VERIFY OTP 
router.post("/verify", async (req, res) => {
    const { otp, user_id,isSeller } = req.body
    const foundOtp = await Otp.findOne({ user: user_id });
    console.log(foundOtp);
    if( foundOtp.isExpired)
    {
        return res.status(401).json({message:"Otp is expired !"})
    }
    else if (otp === foundOtp.otp) {

        await foundOtp.update({isExpired:true});
        if(isSeller)
            await Seller.findByIdAndUpdate(user_id,{isVerified:true});
        else
            await Buyer.findByIdAndUpdate(user_id,{isVerified:true});


        res.status(200).json({ message: "Account verification succeed !" })
    }
    else {
        res.status(403).json({ message: "Otp does not matched try again !" })
    }
})


module.exports = router
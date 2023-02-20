const express = require('express');
const Buyer = require('../models/Buyer');
const router = express.Router();
const bcrypt = require("bcryptjs");
const Seller = require('../models/Seller');
const jwt = require("jsonwebtoken");




router.post('/register', async (req, res) => {
    console.log(req.body);
    if (req.body.isSeller) {
        const { name, email, phone, password, city, address, description, openingTime, closingTime,isSeller } = req.body;

        if (!name || !email || !phone || !password || !city || !address || !description || !openingTime || !closingTime || !isSeller) {
            return res.status(404).json({ error: "make sure you have filled all the details" })
        }

        try {
            const City = city.toLowerCase();
            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync(password, salt);

            const newSeller = await new Seller({
                name,
                email,
                phone,
                password: hashedPassword,
                city: City,
                address,
                description,
                openingTime,
                closingTime,
                isSeller
            }
            );

            const savedSeller = await newSeller.save();

            res.status(201).json({ message: "Seller Registerd successfully", savedSeller });
        }

        catch (err) {
            console.log(err.message);
        }
    } else {
        const { name, email, password, city, dp,isSeller,phone } = req.body;

        if (!name || !email || !password || !city || !dp || !phone) {
            return res.status(404).json({ error: "make sure you have filled all the details for buyers" })
        }

        try {
            const City = city.toLowerCase();
            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync(password, salt);

            const newBuyer = await new Buyer({
                name,
                email,
                password: hashedPassword,
                city: City,
                phone,
                dp
            }
            );

            const savedBuyer = await newBuyer.save();

            res.status(201).json({ message: "Buyer Registerd successfully", savedBuyer });
        }

        catch (err) {
            console.log(err.message);
        }
    }
}


)

router.post('/login', async (req, res) => {
    console.log(req.body);
    var foundUser=false;
    if (req.body.isSeller === false) {
        foundUser = await Buyer.findOne({ email: req.body.email.toLowerCase() });
    }
    else {
        foundUser = await Seller.findOne({ email: req.body.email.toLowerCase() });
    }
    if (!foundUser) {
        return res.status(401).json({ error: "Username or password is not  !" })
    }

    try {
        const passMatch = await bcrypt.compare(req.body.password, foundUser.password);

        if (!passMatch)
            return res.status(401).json({ error: "Username or password is not valid !" })

        const token = jwt.sign({
            id: foundUser._id,
            isSeller:foundUser.isSeller
        },
            process.env.JWT_SECRET,
            { expiresIn: "3d" }
        )

        const { password, ...others } = foundUser._doc;

        return res.status(200).json({ message: "Logged in succeed..", ...others, token });

    }
    catch (error) {
        console.log(error.message);
    }
})



module.exports = router
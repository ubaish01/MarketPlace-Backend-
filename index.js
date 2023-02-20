const express = require('express');
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config();
const cors = require("cors");

// ROUTES IMPORTS 
const authRouter = require("./routes/auth");
const productRouter = require("./routes/product");
const userRoute = require("./routes/user");
const reviewsRoute = require("./routes/reviews");
const mailRoute = require("./routes/mailer");
// ROUTES IMPORTS 


// CONNECTING TO DATABASE 
mongoose.set("strictQuery", false);
const connect = () => mongoose.connect(process.env.MONGO_URL,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Database connnected succeed....")
    })
    .catch(err => {
        console.log(err.message);
    })
// CONNECTING TO DATABASE 
app.get("/",(req,res)=>{
    res.send("working fine");
})

// ROOUTES
app.use(cors());
app.use(express.json());
app.use("/api/auth",authRouter);
app.use("/api/product",productRouter);
app.use("/api/user",userRoute);
app.use("/api/reviews",reviewsRoute);
app.use("/api/mail",mailRoute);
// ROOUTES



app.listen(process.env.PORT, () => {
    connect();
    console.log(process.env.SERVER_STARTING_MSG);
})
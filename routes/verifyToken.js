const jwt = require("jsonwebtoken");



const verifyToken = (req,res,next)=>{
    const authHeader = req.headers.token;
    if(authHeader){
        const token = authHeader.split(" ")[1];
        jwt.verify(token,process.env.JWT_SECRET,(err,user)=>{
            if(err) return res.status(403).json({error:"Token is not valid !"});
            console.log(user)
            req.user = user;
            next();
        })
    }
    else{
        return res.status(401).json({error:"You are not authenticated !"});

    }
}


const verifyTokenAndAuthorization=(req,res,next)=>{
    verifyToken(req,res,()=>{
        if(req.user.id===req.params.id || req.user.isSeller){
            next();
        }
        else
        {
            return res.status(403).json("you are not authorized to access this resource !");
        }
    })
}


const verifyTokenAndSeller=(req,res,next)=>{
    verifyToken(req,res,()=>{
        // console.log(req.user)
        if(req.user.isSeller){
            next();
        }
        else
        {
            return res.status(403).json("you are not authorized to access this maal !");
        }
    })
}

module.exports = {verifyTokenAndAuthorization,
                    verifyTokenAndSeller,
                    verifyToken
}
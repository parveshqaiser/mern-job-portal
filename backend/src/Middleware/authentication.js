
import jwt from "jsonwebtoken";
//  Please refer notes file for better explanation

const authentication = async(req,res, next)=>{

    try {

        let getToken = req?.cookies?.token || req.get("Authorization")?.split(" ")[1];

        if(!getToken){
            res.status(401).json({message: "Unauthorized user", success : false});
            return;
        }

        let verifyToken = jwt.verify(getToken, process.env.TOKEN_SECRET_KEY); // will give userid

        if (!verifyToken)
        {   
            return res.status(401).json({message : "Invalid Token" , success : false});
        }

        req.id = verifyToken.id; // setting individual id so that i can get whenever i asked req.id
        next();
    

    } catch (error) {
        console.log("some error ",error);
        return res.status(500).json({message: "Internal Server Error", success: false});
    }
}

export default authentication;
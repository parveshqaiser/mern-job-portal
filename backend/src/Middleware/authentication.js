
import jwt from "jsonwebtoken";
//  Please refer notes file for better explanation

const authentication = async(req,res, next)=>{

    try {

        let isTokenAvailable = undefined;

        let getToken = req.get("Authorization");  // this is one way 

        if(getToken && getToken.length)
        {
            isTokenAvailable = getToken?.split(" ")[1] || "";  
        }else {
            return res.status(500).json({message: "Error In Getting Token", success: false});
        }

       
        // let isTokenAvailable = req?.cookies?.token; // this is another way

        if (!isTokenAvailable)
        {   
            return res.status(401).json({message : "Unauthorized User" , success : false});
        }

        let decode = await jwt.verify(isTokenAvailable, process.env.TOKEN_SECRET_KEY); // will give user data

        if (!decode)
        {   
            return res.status(401).json({message : "Invalid Token" , success : false});
        }

        req.id = decode.id; // setting individual id so that i can get whenever i asked req.id
        next();
    

    } catch (error) {
        console.log("some error ",error);
        return res.status(500).json({message: "Internal Server Error", success: false});
    }
}

export default authentication;
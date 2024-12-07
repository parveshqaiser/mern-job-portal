
import validator from "validator";

const userRegisterValidation = (req)=>{

    let {fullName, email, password, mobile, role} = req.body;

    if(!fullName || !email || !password || !mobile || !role)
    {
        throw new Error("Input Field Missing");
    }

    if(!fullName || (fullName && fullName.trim()== "")){
        throw new Error("Name required");
    }

    if(fullName && fullName.length <4){
        throw new Error("Provide full name");
    }

    if(!validator.isEmail(email)){
        throw new Error("Invalid Email")
    }

    if(!password || (password && password.trim()== "")){
        throw new Error("Password required");
    }

    if((!/^[6-9]\d{9}$/.test(mobile)))
    {
        throw new Error("Invalid Mobile Number")
    }

    if(!["Student", "Recruiter"].includes(role)){
        throw new Error("Invalid Role")
    }

}

export default userRegisterValidation;
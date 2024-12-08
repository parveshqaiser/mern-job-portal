

const userUpdateValidation = (req)=>{
    let {fullName,mobile,bio, skills, address, totalExp} = req.body;

    let mobileRegex = /^[6-9]\d{9}$/;

    if(!fullName || !mobile || !bio || !skills || !address  || !totalExp)
    {
        throw new Error("Input Field Missing");
    }
    
    if(fullName && fullName.trim()== "")
    {
        throw new Error("Full Name Required");
    }

    if (!mobileRegex.test(mobile)) {
        throw new Error("Invalid mobile number. It should start with 6-9 and be exactly 10 digits long.");
    }

    if(bio && bio.trim()== "")
    {
        throw new Error("Bio Required");
    }

    if(skills && skills.trim()== "")
    {
        throw new Error("Skills Required");
    }

    if(address && address.trim()== "")
    {
        throw new Error("Address Required");
    }

    if(isNaN(totalExp) || totalExp.trim()== "")
    {
        throw new Error("Invalid Work Experience");
    }
}

export default userUpdateValidation;

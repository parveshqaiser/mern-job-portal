

const companyValidation = (req , res) => {
 
    let {companyName ,description, website, location} = req.body;

    if(!companyName || !description || !website || !location){
        throw new Error("Input Field Missing")
    }

    if(!companyName || (companyName && companyName.trim()== "")){
        throw new Error("companyName required");
    }

    if(!description || (description && description.trim()== "")){
        throw new Error("Description required");
    }

    if(!website || (website && website.trim()== "")){
        throw new Error("Website required");
    }

    if(!location || (location && location.trim()== "")){
        throw new Error("Location required");
    }
}

export default companyValidation;

import mongoose from "mongoose";

const  userRegistrationSchema= new mongoose.Schema({
    userId : {
        type : String,
        required: true,
    }, 
    fullName : {
        type : String,
        required : true,
    },
    email : {
        type : String,
        required : true,
        unique : true,
    },
    password : {
        type : String,
        required : true
    },
    mobile : {
        type : String,
        required : true,
    },
    role : {
        type : String,
        enum : ["Student", "Recruiter"],
        required : true,
    },
    profile : {
        bio : {
            type : String
        },
        company : {
            type : mongoose.SchemaTypes.ObjectId,
            ref :"company"
        },
        currentCompany : {
            type : String,
        },
        skills : [
            {type : String}
        ],
        address : {
            type : String
        },
        totalExp : {
            type : String
        },
        resumeName : {
            type : String
        },
        resumeLink : {
            type : String
        },
        roleType : {
            type : String
        },
        profilePicture : {
            type : String, 
            default :""
        },
    }
}, {timestamps: true});

export const userRegistrationDetails  = mongoose.model("registers", userRegistrationSchema)


// trim : true,
// lowercase : true,
// index : true,
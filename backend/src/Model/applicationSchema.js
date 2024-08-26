
import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
    job : {
        type : String,
        ref : "job"
    },
    applicant : {
        type : String, 
        ref : "registers"
    },
    status : {
        type : String,
        enum : ["Pending","Resume Viewed","Accepted","Rejected"],
        default : "Pending",
    }

},{timestamps: true});


export const applicationDetails = mongoose.model("application", applicationSchema);


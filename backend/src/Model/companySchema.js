
import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
    companyName : {
        type : String,
        required:true,
    },
    description : {
        type : String
    },
    website : {
        type : String
    },
    location : {
        type : String
    },
    logo : {
        type : String
    },
    companyId : {
        // type : mongoose.Schema.Types.ObjectId,
        type : String, 
        ref : "registers"
    },

}, {timestamps: true});

export const companyDetails = mongoose.model("company", companySchema);


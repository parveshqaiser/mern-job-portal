
import mongoose from "mongoose";
import validateExpression from "validator";

const companySchema = new mongoose.Schema({
    companyName : {
        type : String,
        required:true,
        trim : true,
    },
    description : {
        type : String,
        required : true,
        trim : true
    },
    website : {
        type : String,
        required : true,
        trim : true
    },
    location : {
        type : String,
        required : true,
        trim : true
    },
    logo : {
        type : String,
        default : "https://www.shutterstock.com/image-vector/image-icon-trendy-flat-style-600nw-643080895.jpg",
        validate (value){
            if(!validateExpression.isURL(value)){
                throw new Error("Invalid Photo URL "+ value)
            }
        }
    },
    companyId : {
        // type : mongoose.Schema.Types.ObjectId,
        type : String, 
        ref : "registers"
    },

}, {timestamps: true});

export const companyDetails = mongoose.model("company", companySchema);


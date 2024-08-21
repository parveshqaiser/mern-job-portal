
import mongoose, { mongo } from "mongoose";

let jobSchema = new mongoose.Schema({
    jobId : {
        type : String,
        required : true,
    },
    title : {
        type :String,
        required : true,
    },
    description : {
        type :String,
        required : true,
    },
    workExperience : {
        type :String,
        required : true,
    },
    qualification: {
        type :String,
        required : true,
    },
    requirements : [{
        type: String,
        required : true,
    }],
    salary : {
        type :String,
        required : true,
    },
    location : {
        type :String,
        required : true,
    },
    openings : {
        type :String,
        required : true,
    },
    jobType : {
        type :String,
        required : true,
    },
    company : {
        // type : mongoose.Schema.Types.ObjectId ,
        type : String,
        ref :"company"
    },
    created_by : {
        // type : mongoose.Schema.Types.ObjectId ,
        type : String,
        ref : "registers"
    },
    application :[{
        type : mongoose.Schema.Types.ObjectId,
        // type : String,
        ref : "application"
    }]
}, {timestamps: true});

export const jobDetails = mongoose.model("job", jobSchema);
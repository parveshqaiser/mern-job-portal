

import { companyDetails } from "../Model/companySchema.js";
import {nanoid} from "nanoid";
import companyValidation from "../Utils/companyValidation.js";

export const registerCompany = async(req,res, uploadResult)=>{

    try {
        let {companyName ,description, website, location} = req.body;

        companyValidation(req);

        let {url} = uploadResult;

        // find method will find arrays of all companies with same name
        let isCompanyExist = await companyDetails.findOne({companyName}); 
        
        if(isCompanyExist)
        {
            return res.status(400).json({message : "Company Already Exist", success: false})
        }

        let generateRandomId = nanoid(6);

        let registerCompany = await companyDetails.create({
            companyId : generateRandomId,
            companyName,
            description,
            website,
            location,
            logo : url || ""
        })

        return res.status(201).json({message :"Company Registered Successfully", success : true ,registerCompany});

    } catch (error) {
        console.log("error in registering company ", error);
        return res.status(500).json({
            message: "An internal server error occurred. Please try again later.",
            success: false
        });
    }

};

export const updateCompanyDetails = async(req,res , isCloudUrl) => {

    try {
        let companyId = req.params.id;

        let {companyName ,description, website, location} = req.body;

        companyValidation(req ,res);

        let updateCompany = await companyDetails.findOne({companyId});

        updateCompany.companyName = companyName;
        updateCompany.description = description;
        updateCompany.website = website;
        updateCompany.location = location;
        updateCompany.logo = isCloudUrl || updateCompany.logo

        let data = await updateCompany.save();
        
        return res.status(201).json({message :"Company Updated", success : true , data});

    } catch (error) {
        console.log("error updating company details ", error );
        return res.status(500).json({
            message: "An internal server error occurred. Please try again later.",
            success: false
        });
    }
};

export const getCompanyDetails = async(req, res)=>{

    try {
        let getAllData = await companyDetails.find({}).sort({ createdAt: -1 });

        return res.status(200).json({
            getAllData,
            success: true,
            message: getAllData.length ? "Company Details fetched successfully" : "No companies available"
        });

    } catch (error) {
        console.log("error fetching company data", error);
        return res.status(500).json({
            message: "An internal server error occurred. Please try again later.",
            success: false
        });
    }
};

export const getCompanyDetailsById = async(req, res) => {

    try {
        let id = req.params.id;

        let company = await companyDetails.findOne({companyId : id});

        if(company == null || company == undefined){
            return res.status(404).json({message :"Company Not found", success : false})
        }

        return res.status(200).json({message: "Company found", success: true, company});
        
    } catch (error) {
        console.log("error found while finding by id **", error);
        return res.status(500).json({
            message: "An internal server error occurred. Please try again later.",
            success: false
        });
    }
};
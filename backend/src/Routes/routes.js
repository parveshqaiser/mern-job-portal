
import express from "express";

import {userRegistration , loginAccount , logoutAccount, updateProfile, getUserData} from "../Controller/userController.js";
import {registerCompany, updateCompanyDetails, getCompanyDetails, getCompanyDetailsById} from "../Controller/companyController.js"
import authentication from "../Middleware/authentication.js";
import {createJobs, getAdminJobs, getAllJobs, getJobById, updateJob } from "../Controller/jobController.js";
import { applyForJobs, getApplicants, getAllJobsAppliedByStudent,updateApplicationStatus } from "../Controller/applicationController.js";
import {singleUpload} from "../Middleware/multer.js";
import cloudUpload from "../Utils/cloudinary.js";
import profileCloudUpload from "../Utils/profileCloudinary.js";


const router = express.Router();

// user
router.post("/register", userRegistration);
router.post("/login", loginAccount);
router.get("/getUserData",authentication ,getUserData);
router.get("/logout", logoutAccount);
router.patch("/update/profile",authentication,singleUpload.array("file",2), async(req, res)=>{
    try {
        let obj = {
            pdfUrl: null,
            imageUrl: null,
            pdfName : null,
        };

        if(req?.files?.length)
        {
           for(let file of req.files)
            {
                let uploadResult = await profileCloudUpload(file.path , file.originalname);
                if(!uploadResult)
                {
                    return res.status(500).json({ message: 'Failed to upload file to Cloudinary', success: false })
                }
    
                if (file.mimetype === "application/pdf")
                {
                    obj.pdfUrl = uploadResult.secure_url,
                    obj.pdfName = uploadResult.public_id
                }else if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
                    obj.imageUrl= uploadResult.secure_url;
                }
            }    
        }

        updateProfile(req, res , obj)
        
    } catch (error) {
        console.log("Error updating profile :", error);
        res.status(500).json({ message: "Internal Server Error", success: false });
    }
});


//  company
router.post("/registerCompany",authentication,singleUpload.single("file"), async(req,res)=>{
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file Uploaded", success: false });
        }

        const uploadResult = await cloudUpload(req.file.path, req.file.originalname);

        if (!uploadResult) {
            return res.status(500).json({ message: 'Failed to upload file to Cloudinary' });
        }

        // register company
        registerCompany(req, res , uploadResult)
    } catch (error) {
        console.log("Error registering company ", error);
        res.status(500).json({ message: "Internal Server Error", success: false });
    }
});

router.patch("/updateCompany/:id", authentication,singleUpload.single("file"), async(req, res)=>{
    try {
        let cloudUrl ;
        if(req.file !== undefined){
            cloudUrl = await cloudUpload(req.file.path, req.file.originalname);

            if (!cloudUrl) {
                return res.status(500).json({ message: 'Failed to upload file to Cloudinary'});
            }
        }

        updateCompanyDetails(req, res, cloudUrl?.url || false);
        
    } catch (error) {
        console.log("Error updating company:", error);
        res.status(500).json({ message: "Internal Server Error", success: false });
    }
});

router.get("/getAllCompanyDetails",authentication, getCompanyDetails);
router.get("/getCompany/:id", authentication, getCompanyDetailsById);


// jobs
router.post("/createJobs", authentication, createJobs);
router.get("/getAllJobs",authentication, getAllJobs);
router.get("/getJobById/:id", authentication , getJobById);
router.get("/getAdminJobs", authentication , getAdminJobs);
router.patch("/update/job/:id" , authentication ,updateJob);


// application
router.post("/applyJobs/:id", authentication, applyForJobs);
router.get("/allJobsAppliedByStudent",authentication, getAllJobsAppliedByStudent);
router.get("/getApplicants/:id", authentication , getApplicants);
router.post("/updateApplicationStatus/:id", authentication , updateApplicationStatus);

export default router;
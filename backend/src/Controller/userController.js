
import { userRegistrationDetails } from "../Model/registerSchema.js";
import bcrypt from "bcrypt";
import {nanoid} from "nanoid";
import jwt from "jsonwebtoken";
import validator from "validator";
import userRegisterValidation from "../Utils/userRegisterValidation.js";
import userUpdateValidation from "../Utils/userUpdateValidation.js";


export const userRegistration = async(req, res)=>{
    
    try {
        let {fullName, email, password, mobile, role} = req.body;
        
        userRegisterValidation(req);

        let isEmailExist = await userRegistrationDetails.findOne({email});
        // let exist = await userRegistrationDetails.findOne({$or : [{email}, {fullName}]})

        if(isEmailExist){
            return res.status(400).json({message : "Email Already Exist", success: false})
        }

        let generateRandomId = nanoid(6);

        let createHashPassword = await bcrypt.hash(password,10); 

        let created = await userRegistrationDetails.create({
            userId : generateRandomId,
            fullName,
            email,
            password : createHashPassword,
            mobile,
            role,
        });

        if(!created)
        {
            return res.status(400).json({message :"Something went wrong while registering..", success: false})
        }
        
        res.status(201).json({message :role + " " + "Account Registered", success : true});

    } catch (error) {
        console.log("** error in registering", error);
        return res.status(500).json({
            message: `${error.message}`,
            success: false
        });
    }
};

export const loginAccount = async (req, res)=>{

    let {email, password,role} = req.body;

    try {
        if(!email || !password || !role)
        {
            return res.status(400).json({message :"Input Fields Missing", success: false});
        }

        if(!validator.isEmail(email)){
            res.status(400).json({message: "Email Required", success : false});
            return;
        }

        if(!password || (password && password.trim()== "")){
            res.status(400).json({message: "Password Required" , success : false});
            return;
        }

        if(!["Student","Recruiter"].includes(role)){
            res.status(400).json({message: "Invalid Role" , success : false});
            return;
        }

        let userData = await userRegistrationDetails.findOne({email});

        if(userData == null)
        {
            return res.status(400).json({message :"Account Doesn't Exist", success: false});
        }

        let matchPassword = await bcrypt.compare(password, userData.password);

        if(!matchPassword){
            return res.status(400).json({message :"Incorrect Password" , success : false});
        }

        if(role !== userData.role)
        {
            return res.status(400).json({message :"Current Role Doesn't match", success : false});
        }

        let generateToken = await jwt.sign({id : userData?.userId}, process.env.TOKEN_SECRET_KEY,{expiresIn :"12h"});

        let user = {
            userId: userData.userId,
            fullName: userData.fullName,
            email: userData.email,
            mobile: userData.mobile,
            role: userData.role,
            profile: userData.profile,
            generateToken
        }

        return res.status(201)
        .cookie("token", generateToken, {maxAge :1*12*60*60*1000 , httpsOnly : true ,sameSite :"strict"})
        .json({message :`${user.role} Login Success`, success : true , user})

    } catch (error) {
        console.log("login error ", error);
        return res.status(500).json({
            message: "An internal server error occurred. Please try again later.",
            success: false
        });
    }
};

export const logoutAccount = async(req, res)=>{

    try {
        return res.status(200).cookie("token", "", {maxAge:0}).json({message :"Logout Success", success : true})
    } catch (error) {
        console.log("error logging out ", error);
        return res.status(500).json({
            message: "An internal server error occurred. Please try again later.",
            success: false
        });
    }
};

export const updateProfile = async(req, res , uploadResult)=>{

    try {

        let {fullName, mobile,bio, skills, address, totalExp, currentCompany} = req.body;

        userUpdateValidation(req);

        let {pdfUrl , imageUrl, pdfName} = uploadResult;

        let skillsList ;
        if(skills && skills.length){
            skillsList = skills.split(",")
        }
       
        let userId = req.id;

        let user = await userRegistrationDetails.findOne({userId}); // very careful in using the key

        if (!user.fullName){
            return res.status(404).json({message: "User Not Found ", success : false})
        }

        user.fullName = fullName;
        user.mobile = mobile;
        user.profile.bio = bio;
        user.profile.address = address || "";
        user.profile.totalExp = totalExp || "";
        user.profile.skills = skillsList;   
        user.profile.resumeName = pdfName || user.profile.resumeName;
        user.profile.resumeLink = pdfUrl || user.profile.resumeLink;
        user.profile.profilePicture = imageUrl || user.profile.profilePicture,
        user.profile.currentCompany = currentCompany || "";

       await user.save();

       user = {
        userId : user.userId,
        fullName: user.fullName,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        profile: user.profile
    }

       return res.status(200).json({message :"Profile Updated", success : true, user});

    } catch (error) {
        console.log("error in updating profile" ,error);
        return res.status(500).json({
            message: `${error?.message}`,
            success: false
        });
    }
};

export const getUserData = async(req, res)=>{

    try {
        let userId = req.id;
        let currentUser = await userRegistrationDetails.findOne({userId});

        if(!currentUser)
        {
            return res.status(404).json({message: "User Not Found", success: false});
        }

        currentUser = {
            userId : currentUser.userId,
            fullName: currentUser.fullName,
            email: currentUser.email,
            mobile: currentUser.mobile,
            role: currentUser.role,
            profile: currentUser.profile
        }
        return res.status(200).json({message: "Data found", success: true, currentUser});

    } catch (error) {
        console.log("error ", error);
        return res.status(500).json({
            message: "An internal server error occurred. Please try again later.",
            success: false
        });
    }
}



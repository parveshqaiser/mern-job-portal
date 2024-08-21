
import { userRegistrationDetails } from "../Model/registerSchema.js";
import bcrypt from "bcrypt";
import {nanoid} from "nanoid";
import jwt from "jsonwebtoken";
import cookie from "cookie-parser";


export const userRegistration = async(req, res)=>{

    let {fullName, email, password, mobile, role} = req.body;
    
    try {
        if(!fullName || !email || !password || !mobile || !role)
        {
            return res.status(400).json({message : "Some input field missing", success: false})
        }

        if((!/^[6-9]\d{9}$/.test(mobile)))
        {
            return res.status(400).json({message : "Invalid Mobile Number", success: false})
        }

        let isEmailExist = await userRegistrationDetails.findOne({email});
        // let exist = await userRegistrationDetails.findOne({$or : [{email}, {fullName}]})

        if(isEmailExist){
            return res.status(400).json({message : "Email Already Exist", success: false})
            // throw new Error("Email Already Exist")
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
        
        return res.status(201).json({message :role + " " + "Account Registered", success : true , data : req.body});

    } catch (error) {
        console.log("** error in registering", error);
        return res.status(500).json({
            message: "An internal server error occurred. Please try again later.",
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

        let userData = await userRegistrationDetails.findOne({email});

        if(userData == null)
        {
            return res.status(400).json({message :"Account Doesn't Exist", success: false});
        }

        let matchPassword = await bcrypt.compare(password, userData.password);

        if(matchPassword == false){
            return res.status(400).json({message :"Incorrect Password" , success : false});
        }

        if(role !== userData.role)
        {
            return res.status(400).json({message :"Current Role Doesn't match", success : false});
        }

        let tokenValue = {id : userData?.userId}

        let generateToken = await jwt.sign(tokenValue, process.env.TOKEN_SECRET_KEY,{expiresIn :"1d"});

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
        .cookie("token", generateToken, {maxAge :1*24*60*60*1000 , httpsOnly : true ,sameSite :"strict"})
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

        let {fullName, email, mobile,bio, skills, address, totalExp, currentCompany} = req.body;

        let {pdfUrl , imageUrl, pdfName} = uploadResult;
        
        if(!fullName || !email || !mobile)
        {
            return res.status(400).json({message : "Some input field missing", success: false})
        }

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
        user.email = email;
        user.profile.bio = bio;
        user.profile.address = address || "";
        user.profile.totalExp = totalExp || "";
        user.profile.skills = skillsList;   
        user.profile.resumeName = pdfName || "";
        user.profile.resumeLink = pdfUrl || "";
        user.profile.profilePicture = imageUrl || "",
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
            message: "An internal server error occurred. Please try again later.",
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



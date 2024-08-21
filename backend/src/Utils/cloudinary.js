
import {v2 as cloudinary} from "cloudinary";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
dotenv.config();

cloudinary.config({
    cloud_name : process.env.CLOUD_NAME,
    api_key : process.env.CLOUD_API_KEY,
    api_secret : process.env.CLOUD_SECRET_KEY,
});

const removeExtension = (filename) => {

    return path.basename(filename, path.extname(filename));
};

const cloudUpload = async(localFilePath, originalname)=>{
    try {
        if(!localFilePath) return null

        const publicId = removeExtension(originalname);
        let response = await cloudinary.uploader.upload(localFilePath, {
            resource_type :"auto", public_id :publicId,
        });

        const optimizeUrl = cloudinary.url(response.public_id, {
            fetch_format: 'auto',
            quality: 'auto'
        });

        return {
            url: response.secure_url,   // Return the secure URL for public access
            public_id: response.public_id,
            downloadUrl : `${optimizeUrl}.pdf`,
        };
    } catch (error) {
        console.log(" some error occurred", error);
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);  // Clean up the local file
        }
        return null;
    }
};

export default cloudUpload;

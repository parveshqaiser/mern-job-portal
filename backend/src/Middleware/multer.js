
import multer from "multer";

// const storage = multer.memoryStorage();
// export const singleUpload = multer({storage}).single("file");

const storage = multer.diskStorage({
    destination : (req, file , cb)=>{
        return cb(null, "../backend/src/uploads"); // please provide the correct path
    },
    filename : (req, file, cb)=>{
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

export const singleUpload = multer({storage});

import express, { urlencoded } from "express";
import cors from "cors";
import dbConnection from "./src/DB/db.connect.js";
import dotenv from "dotenv";
import router from "../backend/src/Routes/routes.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin :"http://localhost:1234",
    credentials : true,
}));
// app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser());

dotenv.config();

app.use("/",router);

dbConnection().then(()=>{
    console.log("Mongo DB Connected");
    
    app.listen(5000, ()=>{
        console.log("Server Running at http://127.0.0.1:5000")
    });
    
}).catch((err)=>{
    console.log("Db failed to connect", err);
});





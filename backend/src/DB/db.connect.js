
import mongoose from "mongoose";

const dbConnection = async ()=>{

    try {
        let response = await mongoose.connect(process.env.MONGO_DB_URL);
    } catch (error) {
        console.log("Some Error connecting DB ", error);
    }
}

export default dbConnection;
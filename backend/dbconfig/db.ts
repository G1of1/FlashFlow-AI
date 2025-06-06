import mongoose from "mongoose";
import dotenv from 'dotenv';
export const connectDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URI as string);
        console.log(`Database Connected: ${connection.connection.host}`);
    }
    catch(error: any) {
        console.log(`Error: ${error.message}`);
        process.exit(1);
    }
}
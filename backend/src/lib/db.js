import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// setting up mongodb server
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.log("Error connecting to MongoDB", error);
        process.exit(1);
    }
}

export default connectDB;
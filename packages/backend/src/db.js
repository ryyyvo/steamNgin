import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({path: '/home/ryanvo/code/steamNgin/packages/backend/.env'});

const MONGO_URI = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI)
  } catch (error) {
    console.error('MongoDB connection error:', error);
    setTimeout(connectDB, 5000);
  }
};

export default connectDB;
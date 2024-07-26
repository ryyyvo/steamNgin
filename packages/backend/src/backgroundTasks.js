import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { startPlayerCountRefresh } from './refreshPlayerCount.js';

dotenv.config({path: '/home/ryanvo/code/steamNgin/packages/backend/.env'});


const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('Background tasks: Connected to MongoDB');

    // Start the player count refresh schedule
    startPlayerCountRefresh();
  } catch (err) {
    console.error('Background tasks error:', err);
    process.exit(1);
  }
};

start();

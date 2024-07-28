import Fastify from 'fastify'
import mongoose, { connect } from 'mongoose';
import cors from '@fastify/cors';
import dotenv from 'dotenv';
import connectDB from './db.js';
import routes from './routes/index.js';
import { startPlayerCountRefresh } from './refreshPlayerCount.js';

dotenv.config({path: '/home/ryanvo/code/steamNgin/packages/backend/.env'});

const fastify = Fastify({
  logger: true
})

await fastify.register(cors, {
  origin: true
});

fastify.register(routes);

mongoose.connection.on('connected', () => {
  console.log('MongoDB connection established');
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected. Attempting to reconnect...');
  connectDB();
});

mongoose.connection.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

const start = async () => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }
    const PORT = process.env.PORT || 10000;
    await fastify.listen({ port: PORT, host: '0.0.0.0' });
    console.log(`Server is running on port ${PORT}`);
    startPlayerCountRefresh();
  } catch (err) {
    fastify.log.error(err);
    console.log('Server start failed. Attempting to restart...');
    setTimeout(start, 5000);
  }
};

connectDB().catch(err => {
  console.error('Initial MongoDB connection failed:', err);
});

start();

process.on('SIGINT', async () => {
  await mongoose.disconnect();
  console.log('\nMongoDB disconnected through app termination');
  process.exit(0);
});
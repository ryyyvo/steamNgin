import Fastify from 'fastify'
import mongoose from 'mongoose';
import cors from '@fastify/cors';
import dotenv from 'dotenv';
import connectDB from './db.js';
import PlayerCount from './models/PlayerCount.js';
import { startPlayerCountRefresh } from './refreshPlayerCount.js';

dotenv.config({path: '/home/ryanvo/code/steamNgin/packages/backend/.env'});

const fastify = Fastify({
  logger: true
})

// Register CORS plugin
await fastify.register(cors, {
  origin: true
});

// Declare a route
fastify.get('/', async (request, reply) => {
  return { steamNgin: '1' }
})

// Route to get all player counts
fastify.get('/api/playercounts', async (request, reply) => {
  try {
    const page = parseInt(request.query.page) || 1;
    const limit = parseInt(request.query.limit) || 100;
    const skip = (page - 1) * limit;

    const playerCounts = await PlayerCount.find()
      .sort({ playerCount: -1 })
      .skip(skip)
      .limit(limit);

    const total = await PlayerCount.countDocuments();

    return {
      playerCounts,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    };
  } catch (error) {
      console.error('Error fetching player counts:', error);
      reply.code(500).send({ error: 'Internal Server Error' });
  }
});

// Route to get a specific game's player count
fastify.get('/api/playercounts/:appid', async (request, reply) => {
  try {
    const { appid } = request.params;
    const playerCount = await PlayerCount.findOne({ appid });
    if (!playerCount) {
      reply.code(404).send({ error: 'Game not found' });
      return;
    }
    return playerCount;
  } catch (error) {
    reply.code(500).send({ error: 'Internal Server Error' });
  }
});

// Set up MongoDB connection listeners
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

// Start the server
const start = async () => {
  try {
    // Connect to MongoDB
    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }
    const PORT = process.env.PORT || 10000;
    await fastify.listen({ port: PORT, host: '0.0.0.0' });
    console.log(`Server is running on port ${PORT}`);
    startPlayerCountRefresh();
  } catch (err) {
    fastify.log.error(err);
    console.log('Server start failed. Attempting to reconnect...');
    setTimeout(start, 5000); // Attempt to restart after 5 seconds
  }
};

connectDB().catch(err => {
  console.error('Initial MongoDB connection failed:', err);
});

start();

// Handle graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.disconnect();
  console.log('\nMongoDB disconnected through app termination');
  process.exit(0);
});
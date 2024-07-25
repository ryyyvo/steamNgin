import Fastify from 'fastify'
import mongoose from 'mongoose';
import cors from '@fastify/cors';
import dotenv from 'dotenv';
import PlayerCount from './models/PlayerCount.js';
import { startPlayerCountRefresh } from './refreshPlayerCount.js';

dotenv.config({path: '/home/ryanvo/code/steamNgin/packages/backend/.env'});

const PORT = 3000
const MONGO_URI = process.env.MONGO_URI;

const fastify = Fastify({
  logger: true
})

// Register CORS plugin
await fastify.register(cors, {
  origin: true // Allow all origins
  // If you want to restrict it to specific origins:
  // origin: ['http://localhost:5173', 'https://yourdomain.com']
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

// Start the server
const start = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log(`Connected to MongoDB`);
    await fastify.listen({ port: PORT });
    console.log('Server is running on http://localhost:3000');
    startPlayerCountRefresh();
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
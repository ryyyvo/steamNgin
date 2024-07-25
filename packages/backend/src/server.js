import Fastify from 'fastify'
import fastifyMongodb from '@fastify/mongodb';
import dotenv from 'dotenv';

dotenv.config({path: '../.env'});

const PORT = 3000
const MONGO_URI = process.env.MONGO_URI;

const fastify = Fastify({
  logger: true
})

// Register MongoDB plugin
fastify.register(fastifyMongodb, {
  url: MONGO_URI,
});

// Define a route to get player count data
fastify.get('/api/player-counts', async (request, reply) => {
  const collection = fastify.mongo.db.collection('playercounts');
  const playerCounts = await collection.find({}).toArray();
  reply.send(playerCounts);
});

// Declare a route
fastify.get('/', async (request, reply) => {
    return { hello: 'world' }
  })

// Run the server!
const start = async () => {
    try {
      await fastify.listen({ port: PORT })
      fastify.log.info(`Server listening at port ${PORT}`);
    } catch (err) {
      fastify.log.error(err)
      process.exit(1)
    }
  }
start()
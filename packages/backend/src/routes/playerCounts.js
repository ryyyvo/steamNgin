import PlayerCount from '../models/PlayerCount.js';

export default async function playerCountRoutes(fastify, options) {
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
      fastify.log.error('Error fetching player counts:', error);
      reply.code(500).send({ error: 'Internal Server Error' });
    }
  });

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
      fastify.log.error('Error fetching specific player count:', error);
      reply.code(500).send({ error: 'Internal Server Error' });
    }
  });
}
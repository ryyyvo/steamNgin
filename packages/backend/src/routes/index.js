import playerCountRoutes from './playerCounts.js';

export default async function routes(fastify, options) {
  fastify.get('/', async (request, reply) => {
    return { steamNgin: '1' };
  });

  await fastify.register(playerCountRoutes);
}
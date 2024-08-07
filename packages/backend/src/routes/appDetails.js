export default async function appDetailsRoutes(fastify, options) {
  fastify.get('/api/steam/appdetails/:appId', async (request, reply) => {
    const { appId } = request.params;
    const language = request.query.language || 'english';
    try {
      const response = await fetch(`https://store.steampowered.com/api/appdetails?appids=${appId}&l=${language}`);
      const data = await response.json();
      return data;
    } 
    catch (error) {
      fastify.log.error(error);
      reply.code(500).send({ error: 'Error fetching app details' });
    }
  });
}
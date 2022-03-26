// Require the framework and instantiate it
import Fastify from 'fastify'
const fastify = Fastify({
  logger: true
});

// Declare a route
fastify.get('/', async (request, reply) => {
  return { hello: 'world' }
})

// Run the server!
const start = async () => {
  try {
    await fastify.listen(3030);
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start();
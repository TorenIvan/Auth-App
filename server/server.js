import Fastify from "fastify";
import dotenv from "dotenv";
import mongodb from "fastify-mongodb";

const fastify = Fastify({
  logger: true,
});

dotenv.config();

fastify.register(mongodb, {
  forceClose: true,
  url: process.env.CONNECT_DB,
});

fastify.get("/", async (request, reply) => {
  return { hello: "world" };
});

const start = async () => {
  try {
    await fastify.listen(3030);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();

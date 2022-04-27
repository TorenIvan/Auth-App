import Fastify from "fastify";
import dotenv from "dotenv";
import mongodb from "fastify-mongodb";
import cors from "fastify-cors";

const fastify = Fastify({
  logger: true,
});

dotenv.config();

fastify.register(mongodb, {
  forceClose: true,
  url: process.env.CONNECT_DB,
});

fastify.register(cors, {
  origin: [
    process.env.FRONT_END_URI,
    process.env.BACK_END_URI,
    process.env.GITHUB_URI,
  ],
  methods: ["GET", "PUT", "POST", "DELETE"],
  credentials: true,
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

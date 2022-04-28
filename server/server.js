import Fastify from "fastify";
import dotenv from "dotenv";
import mongodb from "fastify-mongodb";
import cors from "fastify-cors";
import authRoutes from "./routes/auth/index.js";

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
    process.env.GITHUB_URI,
  ],
  methods: ["GET", "PUT", "POST", "DELETE"],
  credentials: true,
});

fastify.get("/", async (request, reply) => {
  return { hello: "world" };
});

fastify.register(authRoutes, { prefix: '/auth' });

const start = async () => {
  try {
    await fastify.listen(process.env.PORT, process.env.ADDRESS);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();

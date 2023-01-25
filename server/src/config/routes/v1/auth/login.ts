import { FastifyInstance, FastifyPluginAsync } from "fastify";

/**
 * Encapsulates the login route
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 */
const login: FastifyPluginAsync = async (
  fastify: FastifyInstance
): Promise<void> => {
  fastify.get("/", async function (request, reply) {
    return "WTF is going on here; plz help";
  });
};

export default login;

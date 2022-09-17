import { FastifyPluginAsync } from "fastify";

const register: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get("/auth/register/", async function (request, reply) {
    return "this is an example";
  });
};

export default register;

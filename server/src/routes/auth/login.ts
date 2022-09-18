import { FastifyPluginAsync } from "fastify";

const login: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get("/auth/login/", async function (request, reply) {
    return "WTF is going on here; plz help";
  });
};

export default login;

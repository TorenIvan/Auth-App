import githubOauthRoute from "./oauth/github.js";

const authRoutes = (fastify, options, done) => {
  fastify.route({
    method: "GET",
    url: "/",
    schema: {
      response: {
        200: {
          type: "object",
          properties: {
            hello: { type: "string" },
          },
        },
      },
    },
    handler: function (request, reply) {
      reply.send({ hello: "Why Me God" });
    },
  });

  fastify.register(githubOauthRoute, { prefix: "/github/oauth" });

  done();
};


export default authRoutes;

import githubOauthRoute from "./oauth/github.js";

const authRoutes = (fastify, options, done) => {
  // fastify.route({
  //   method: "GET",
  //   url: "/",
  //   schema: {
  //     response: {
  //       200: {
  //         type: "object",
  //         properties: {
  //           hello: { type: "string" },
  //         },
  //       },
  //     },
  //   },
  //   handler: function (request, reply) {
  //     reply.send({ hello: "Why Me God" });
  //   },
  // });

  fastify.register(githubOauthRoute, { prefix: "/github" });
  // fastify.register(facebookOauthRoute, { prefix: "/facebook/oauth" });
  // fastify.register(twitterOauthRoute, { prefix: "/twitter/oauth" });
  // fastify.register(googleOauthRoute, { prefix: "/google/oauth" });

  done();
};


export default authRoutes;

const github = (fastify, options, done) => {
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
      reply.send({ hello: "github" });
    },
  });

  done();
};


export default github;
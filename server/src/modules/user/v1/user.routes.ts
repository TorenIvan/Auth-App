import {
  FastifyInstance,
  FastifyPluginAsync,
  FastifyReply,
  FastifyRequest,
} from "fastify";
import { ZodError, Schema as ZodSchema } from "zod";
import {
  authCredentialsBodySchema,
  forgotPasswordRequestSchema,
  resetPasswordRequestSchema,
  userEditRequestBodySchema,
  verifyEmailQueryStringSchema,
} from "./user.schema";
import UserController from "./user.controller";


/**
 * @description Encapsulates all the routes belonging to user in version 1
 */
const userRoutesV1 = (controller: UserController): FastifyPluginAsync => async (
  fastify: FastifyInstance
): Promise<void> => {
  fastify.register(refreshTokens(controller), { prefix: "/v1/auth/refresh" });
  fastify.register(checkIsAuthenticated(controller), { prefix: "/v1/auth/check" });
  fastify.register(loginWithCredentials(controller), { prefix: "/v1/auth/login/credentials" });
  fastify.register(loginWithFacebook(controller), { prefix: "/v1/auth/login/facebook" });
  fastify.register(registerWithCredentials(controller), { prefix: "/v1/auth/register/credentials" });
  fastify.register(logout(controller), { prefix: "/v1/auth/logout" });
  fastify.register(confirmEmail(controller), { prefix: "/v1/auth/verify" });
  fastify.register(forgotPassword(controller), { prefix: "/v1/auth/forgot-password" });
  fastify.register(resetPassword(controller), { prefix: "/v1/auth/reset-password" });
  fastify.register(getUserDetails(controller), { prefix: "/v1/user/details" });
  fastify.register(editUserDetails(controller), { prefix: "/v1/user/edit",});
  // fastify.register(loginWithGoogle, {
  //   prefix: "/v1/auth/login/google",
  // });
  // fastify.register(loginWithGithub, {
  //   prefix: "/v1/auth/login/github",
  // });
  // fastify.register(loginWithTwitter, {
  //   prefix: "/v1/auth/login/twitter",
  // });
};

export default userRoutesV1;


const refreshTokens = (controller: UserController): FastifyPluginAsync => {
  return async (fastify: FastifyInstance) => {
    fastify.addHook("onRequest", async (request, reply) => {
      await fastify.verifyRefreshTokenCookie(request, reply);
      await fastify.verifySocialProfileTokenCookie(request, reply);
    });
    fastify.get("/", controller.renewTokens.bind(controller));
  };
};

const checkIsAuthenticated = (controller: UserController): FastifyPluginAsync => {
  return async (fastify: FastifyInstance) => {
    fastify.addHook("preHandler", async (request, reply) => {
      await fastify.isAuthenticated(request, reply);
    });
    fastify.get("/", {}, controller.checkIfUserIsAuthenticated.bind(controller));
  };
};

const loginWithCredentials = (controller: UserController): FastifyPluginAsync => {
  return async (fastify: FastifyInstance) => {
    fastify.addHook("preHandler", async (request: FastifyRequest, reply: FastifyReply) => {
      await fastify.actionForbiddenToAuthenticatedUser(request, reply);
      await validateRequestBody(request, reply, authCredentialsBodySchema);
    });
    fastify.post("/", controller.loginCredentialsHandler.bind(controller));
  };
};

const loginWithFacebook = (controller: UserController): FastifyPluginAsync => {
  return async (fastify: FastifyInstance) => {
    fastify.addHook("preHandler", async (request, reply) => {
      await fastify.actionForbiddenToAuthenticatedUser(request, reply);
    });
    fastify.post("/", controller.loginFacebookHandler.bind(controller));
  };
};

// async function loginWithGoogle(fastify: FastifyInstance): Promise<void> {
//   fastify.get("/", async function (request, reply) {
//     return "this is a login example route with google";
//   });
// }

//async function loginWithGithub(fastify: FastifyInstance): Promise<void> {
//  fastify.get("/", async function (request, reply) {
//    return "this is a login example route with github";
//  });
//}

// async function loginWithTwitter(fastify: FastifyInstance): Promise<void> {
//   fastify.get("/", async function (request, reply) {
//     return "this is a login example route with twitter";
//   });
// }

const registerWithCredentials = (controller: UserController): FastifyPluginAsync => {
  return async (fastify: FastifyInstance): Promise<void> => {
    fastify.addHook("preHandler", async (request, reply) => {
      await fastify.actionForbiddenToAuthenticatedUser(request, reply);
      await validateRequestBody(request, reply, authCredentialsBodySchema);
    });
    fastify.post("/", controller.registerCredentialsHandler.bind(controller));
  };
};

const logout = (controller: UserController): FastifyPluginAsync => {
  return async (fastify: FastifyInstance) => {
    fastify.addHook("preHandler", async (request, reply) => {
      await fastify.verifyAccessTokenHeader(request, reply);
    });
    fastify.post("/", {}, controller.logout.bind(controller));
  };
};

const confirmEmail = (controller: UserController): FastifyPluginAsync => {
  return async (fastify: FastifyInstance) => {
    fastify.addHook("preHandler", async (request, reply) => {
      await validateRequestQuery(request, reply, verifyEmailQueryStringSchema);
    });
    fastify.get("/", controller.confirmEmailHandler.bind(controller));
  };
};

const forgotPassword = (controller: UserController): FastifyPluginAsync => {
  return async (fastify: FastifyInstance) => {
    fastify.addHook("preHandler", async (request, reply) => {
      await validateRequestBody(request, reply, forgotPasswordRequestSchema);
    });
    fastify.post("/", controller.forgotPasswordHandler.bind(controller));
  };
};

const resetPassword = (controller: UserController): FastifyPluginAsync => {
  return async (fastify: FastifyInstance) => {
    fastify.addHook("onRequest", async (request, reply) => {
      await fastify.verifyResetPasswordCookie(request, reply);
    });
    fastify.addHook("preHandler", async (request, reply) => {
      await validateRequestQuery(request, reply, verifyEmailQueryStringSchema);
      await validateRequestBody(request, reply, resetPasswordRequestSchema);
    });
    fastify.post("/", controller.resetPasswordHandler.bind(controller));
  };
};

const getUserDetails = (controller: UserController): FastifyPluginAsync => {
  return async (fastify: FastifyInstance) => {
    fastify.addHook("preHandler", async (request, reply) => {
      await fastify.verifyAccessTokenHeader(request, reply);
    });
    fastify.get("/", controller.retrieveUserDetails.bind(controller));
  };
};

const editUserDetails = (controller: UserController): FastifyPluginAsync => {
  return async (fastify: FastifyInstance) => {
    fastify.addHook("preHandler", async (request, reply) => {
      await fastify.verifyAccessTokenHeader(request, reply);
      await validateRequestBody(request, reply, userEditRequestBodySchema);
    });
    fastify.post("/", controller.updateUserDetails.bind(controller));
  };
};

async function validateRequestBody<T>(
  request: FastifyRequest,
  reply: FastifyReply,
  schema: ZodSchema<T>
): Promise<void> {
  try {
    request.body = await schema.parseAsync(request.body);
  } catch (error) {
    if (error instanceof ZodError) {
      const firstError = error.errors[0];
      return reply.status(400).send(firstError);
    }
    return reply.status(400).send(error);
  }
}

async function validateRequestQuery<T>(
  request: FastifyRequest,
  reply: FastifyReply,
  schema: ZodSchema<T>
): Promise<void> {
  try {
    request.query = await schema.parseAsync(request.query);
  } catch (error) {
    if (error instanceof ZodError) {
      const firstError = error.errors[0];
      return reply.status(400).send(firstError);
    }
    return reply.status(400).send(error);
  }
}

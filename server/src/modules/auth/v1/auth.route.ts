import {
  FastifyInstance,
  FastifyPluginAsync,
  FastifyReply,
  FastifyRequest,
} from "fastify";
import AuthController from "./auth.controller";
import { validateRequestBody, validateRequestQuery } from "../../../config/utils/helpers";
import { 
    authCredentialsBodySchema, 
    forgotPasswordRequestSchema, 
    resetPasswordRequestSchema, 
    verifyEmailQueryStringSchema 
} from "./auth.schema";


/**
 * @description Encapsulates all the routes belonging to auth in version 1
 */
const authRoutesV1 = (controller: AuthController): FastifyPluginAsync => async (
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
}

export default authRoutesV1;

const refreshTokens = (controller: AuthController): FastifyPluginAsync => {
  return async (fastify: FastifyInstance) => {
    fastify.addHook("onRequest", async (request, reply) => {
      await fastify.verifyRefreshTokenCookie(request, reply);
      await fastify.verifySocialProfileTokenCookie(request, reply);
    });
    fastify.get("/", controller.renewTokens.bind(controller));
  };
};

const checkIsAuthenticated = (controller: AuthController): FastifyPluginAsync => {
  return async (fastify: FastifyInstance) => {
    fastify.addHook("preHandler", async (request, reply) => {
      await fastify.isAuthenticated(request, reply);
    });
    fastify.get("/", {}, controller.checkIfUserIsAuthenticated.bind(controller));
  };
};

const loginWithCredentials = (controller: AuthController): FastifyPluginAsync => {
  return async (fastify: FastifyInstance) => {
    fastify.addHook("preHandler", async (request: FastifyRequest, reply: FastifyReply) => {
      await validateRequestBody(request, reply, authCredentialsBodySchema);
    });
    fastify.post("/", controller.loginCredentialsHandler.bind(controller));
  };
};

const loginWithFacebook = (controller: AuthController): FastifyPluginAsync => {
  return async (fastify: FastifyInstance) => {
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

const registerWithCredentials = (controller: AuthController): FastifyPluginAsync => {
  return async (fastify: FastifyInstance): Promise<void> => {
    fastify.addHook("preHandler", async (request, reply) => {
      await validateRequestBody(request, reply, authCredentialsBodySchema);
    });
    fastify.post("/", controller.registerCredentialsHandler.bind(controller));
  };
};

const logout = (controller: AuthController): FastifyPluginAsync => {
  return async (fastify: FastifyInstance) => {
    fastify.addHook("preHandler", async (request, reply) => {
      await fastify.verifyAccessTokenHeader(request, reply);
    });
    fastify.post("/", {}, controller.logout.bind(controller));
  };
};

const confirmEmail = (controller: AuthController): FastifyPluginAsync => {
  return async (fastify: FastifyInstance) => {
    fastify.addHook("preHandler", async (request, reply) => {
      await validateRequestQuery(request, reply, verifyEmailQueryStringSchema);
    });
    fastify.get("/", controller.confirmEmailHandler.bind(controller));
  };
};

const forgotPassword = (controller: AuthController): FastifyPluginAsync => {
  return async (fastify: FastifyInstance) => {
    fastify.addHook("preHandler", async (request, reply) => {
      await validateRequestBody(request, reply, forgotPasswordRequestSchema);
    });
    fastify.post("/", controller.forgotPasswordHandler.bind(controller));
  };
};

const resetPassword = (controller: AuthController): FastifyPluginAsync => {
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
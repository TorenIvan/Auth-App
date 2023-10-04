import {
  FastifyInstance,
  FastifyPluginAsync,
  FastifyReply,
  FastifyRequest,
} from "fastify";
import { ZodError, Schema as ZodSchema } from "zod";
import {
  authCredsBodySchema,
  forgotPasswordRequestSchema,
  resetPasswordRequestSchema,
  userEditRequestBodySchema,
  verifyEmailQueryStringSchema,
} from "./user.schema";
import UserController from "./user.controller";

/**
 * Encapsulates all the routes belonging to user in version 1
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 */
const userRoutes: FastifyPluginAsync = async (
  fastify: FastifyInstance,
  _: object
): Promise<void> => {
  fastify.register(refreshTokens, {
    prefix: "/v1/auth/refresh",
  });
  fastify.register(checkIsAuthenticated, {
    prefix: "/v1/auth/check",
  });
  fastify.register(loginWithCredentials, {
    prefix: "/v1/auth/login/credentials",
  });
  fastify.register(loginWithFacebook, {
    prefix: "/v1/auth/login/facebook",
  });
  fastify.register(loginWithGoogle, {
    prefix: "/v1/auth/login/google",
  });
  fastify.register(loginWithGithub, {
    prefix: "/v1/auth/login/github",
  });
  fastify.register(loginWithTwitter, {
    prefix: "/v1/auth/login/twitter",
  });
  fastify.register(registerWithCredentials, {
    prefix: "/v1/auth/register/credentials",
  });
  fastify.register(registerWithFacebook, {
    prefix: "/v1/auth/register/facebook",
  });
  fastify.register(registerWithGoogle, {
    prefix: "/v1/auth/register/google",
  });
  fastify.register(registerWithGithub, {
    prefix: "/v1/auth/register/github",
  });
  fastify.register(registerWithTwitter, {
    prefix: "/v1/auth/register/twitter",
  });
  fastify.register(logout, {
    prefix: "/v1/auth/logout",
  });
  fastify.register(confirmEmail, {
    prefix: "/v1/auth/verify",
  });
  fastify.register(forgotPassword, {
    prefix: "/v1/auth/forgot-password",
  });
  fastify.register(resetPassword, {
    prefix: "/v1/auth/reset-password",
  });
  fastify.register(getUserDetails, {
    prefix: "/v1/profile/details",
  });
  fastify.register(editUserDetails, {
    prefix: "/v1/profile/edit",
  });
};

export default userRoutes;

/**
 * Encapsulates the refresh token verification and renewing tokens
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 */
async function refreshTokens(fastify: FastifyInstance): Promise<void> {
  fastify.addHook("onRequest", async (request, reply) => {
    await fastify.verifyRefreshTokenCookie(request, reply);
  });
  fastify.get("/", new UserController(fastify).renewTokens);
}

/**
 * Encapsulates the checking operation of user authentication status
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 */
async function checkIsAuthenticated(fastify: FastifyInstance): Promise<void> {
  fastify.addHook("preHandler", async (request, reply) => {
    await fastify.checkIfUserIsAuthenticated(request, reply);
  });
  fastify.get("/", {}, new UserController(fastify).checkIfUserIsAuthenticated);
}

/**
 * Encapsulates the login with credentials route
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 */
async function loginWithCredentials(fastify: FastifyInstance): Promise<void> {
  fastify.addHook("preHandler", async (request, reply) => {
    await validateRequestBody(request, reply, authCredsBodySchema);
  });
  fastify.post("/", new UserController(fastify).loginCredentialsHandler);
}

/**
 * Encapsulates the login with facebook route
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 */
async function loginWithFacebook(fastify: FastifyInstance): Promise<void> {
  fastify.get("/", new UserController(fastify).loginFacebookHandler);
}

/**
 * Encapsulates the login with google route
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 */
async function loginWithGoogle(fastify: FastifyInstance): Promise<void> {
  fastify.get("/", async function (request, reply) {
    return "this is a login example route with google";
  });
}

/**
 * Encapsulates the login with github route
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 */
async function loginWithGithub(fastify: FastifyInstance): Promise<void> {
  fastify.get("/", async function (request, reply) {
    return "this is a login example route with github";
  });
}

/**
 * Encapsulates the login with twitter route
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 */
async function loginWithTwitter(fastify: FastifyInstance): Promise<void> {
  fastify.get("/", async function (request, reply) {
    return "this is a login example route with twitter";
  });
}

/**
 * Encapsulates the register with credentials route
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 */
async function registerWithCredentials(
  fastify: FastifyInstance
): Promise<void> {
  fastify.addHook("preHandler", async (request, reply) => {
    await validateRequestBody(request, reply, authCredsBodySchema);
  });
  fastify.post("/", new UserController(fastify).registerCredentialsHandler);
}

/**
 * Encapsulates the register facebook route
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 */
async function registerWithFacebook(fastify: FastifyInstance): Promise<void> {
  fastify.get("/", async function (request, reply) {
    return "this is an example facebook";
  });
}

/**
 * Encapsulates the register google route
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 */
async function registerWithGoogle(fastify: FastifyInstance): Promise<void> {
  fastify.get("/", async function (request, reply) {
    return "this is an example google";
  });
}

/**
 * Encapsulates the register github route
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 */
async function registerWithGithub(fastify: FastifyInstance): Promise<void> {
  fastify.get("/", async function (request, reply) {
    return "this is an example github";
  });
}

/**
 * Encapsulates the register twitter route
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 */
async function registerWithTwitter(fastify: FastifyInstance): Promise<void> {
  fastify.get("/", async function (request, reply) {
    return "this is an example twitter";
  });
}

/**
 * Encapsulates the logout operation route
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 */
async function logout(fastify: FastifyInstance): Promise<void> {
  fastify.addHook("preHandler", async (request, reply) => {
    await fastify.verifyAccessTokenHeader(request, reply);
  });
  fastify.post("/", {}, new UserController(fastify).logout);
}

/**
 * Encapsulates the email verification process route
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 */
async function confirmEmail(fastify: FastifyInstance): Promise<void> {
  fastify.addHook("preHandler", async (request, reply) => {
    await validateRequestQuery(request, reply, verifyEmailQueryStringSchema);
  });
  fastify.get("/", new UserController(fastify).confirmEmailHandler);
}

/**
 * Encapsulates the forgot password operation route
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 */
async function forgotPassword(fastify: FastifyInstance): Promise<void> {
  fastify.addHook("preHandler", async (request, reply) => {
    await validateRequestBody(request, reply, forgotPasswordRequestSchema);
  });
  fastify.post("/", new UserController(fastify).forgotPasswordHandler);
}

/**
 * Encapsulates the reset password operation route
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 */
async function resetPassword(fastify: FastifyInstance): Promise<void> {
  fastify.addHook("onRequest", async (request, reply) => {
    await fastify.verifyResetPasswordCookie(request, reply);
  });
  fastify.addHook("preHandler", async (request, reply) => {
    await validateRequestQuery(request, reply, verifyEmailQueryStringSchema);
    await validateRequestBody(request, reply, resetPasswordRequestSchema);
  });
  fastify.post("/", new UserController(fastify).resetPasswordHandler);
}

/**
 * Encapsulates all the user profile details operation route
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 */
async function getUserDetails(fastify: FastifyInstance): Promise<void> {
  fastify.addHook("preHandler", async (request, reply) => {
    await fastify.verifyAccessTokenHeader(request, reply);
  });
  fastify.get("/", new UserController(fastify).retrieveUserDetails);
}

/**
 * Encapsulates all the user profile editing operation route
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 */
async function editUserDetails(fastify: FastifyInstance): Promise<void> {
  fastify.addHook("preHandler", async (request, reply) => {
    await fastify.verifyAccessTokenHeader(request, reply);
    await validateRequestBody(request, reply, userEditRequestBodySchema);
  });
  fastify.post("/", new UserController(fastify).updateUserDetails);
}

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

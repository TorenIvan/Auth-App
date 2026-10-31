import { FastifyInstance, FastifyPluginAsync, FastifyReply, FastifyRequest } from 'fastify';
import AuthController from './auth.controller';
import { validateRequestBody, validateRequestQuery } from '../../../config/utils/helpers';
import {
  authCredentialsBodySchema,
  forgotPasswordRequestSchema,
  oauthCodeBodySchema,
  resetPasswordRequestSchema,
  verifyEmailQueryStringSchema,
} from './auth.schema';

/**
 * @description Brute force protection for the routes that accept credentials or send emails.
 * The rate limit plugin is registered once in app.ts (global: false); routes opt in with this config.
 */
const authRateLimit = { rateLimit: { max: 5, timeWindow: '1 minute' } };

/**
 * @description Encapsulates all the routes belonging to auth in version 1
 */
const authRoutesV1 =
  (controller: AuthController): FastifyPluginAsync =>
  async (fastify: FastifyInstance): Promise<void> => {
    fastify.register(refreshTokens(controller), { prefix: '/v1/auth/refresh' });
    fastify.register(checkIsAuthenticated(controller), { prefix: '/v1/auth/check' });
    fastify.register(loginWithCredentials(controller), { prefix: '/v1/auth/login/credentials' });
    fastify.register(loginWithGithub(controller), { prefix: '/v1/auth/login/github' });
    fastify.register(loginWithGitlab(controller), { prefix: '/v1/auth/login/gitlab' });
    fastify.register(loginWithGoogle(controller), { prefix: '/v1/auth/login/google' });
    fastify.register(loginWithDiscord(controller), { prefix: '/v1/auth/login/discord' });
    fastify.register(registerWithCredentials(controller), {
      prefix: '/v1/auth/register/credentials',
    });
    fastify.register(logout(controller), { prefix: '/v1/auth/logout' });
    fastify.register(logoutAll(controller), { prefix: '/v1/auth/logout-all' });
    fastify.register(confirmEmail(controller), { prefix: '/v1/auth/verify' });
    fastify.register(forgotPassword(controller), { prefix: '/v1/auth/forgot-password' });
    fastify.register(resetPassword(controller), { prefix: '/v1/auth/reset-password' });
  };

export default authRoutesV1;

const refreshTokens = (controller: AuthController): FastifyPluginAsync => {
  return async (fastify: FastifyInstance) => {
    fastify.addHook('onRequest', async (request, reply) => {
      await fastify.verifySameOrigin(request, reply);
      if (reply.sent) return;
      await fastify.verifyRefreshTokenCookie(request, reply);
    });
    // POST: rotating the refresh token changes state
    fastify.post('/', controller.renewTokens.bind(controller));
  };
};

const checkIsAuthenticated = (controller: AuthController): FastifyPluginAsync => {
  return async (fastify: FastifyInstance) => {
    fastify.addHook('preHandler', async (request, reply) => {
      await fastify.verifySameOrigin(request, reply);
      if (reply.sent) return;
      await fastify.isAuthenticated(request, reply);
    });
    fastify.get('/', {}, controller.checkIfUserIsAuthenticated.bind(controller));
  };
};

const loginWithCredentials = (controller: AuthController): FastifyPluginAsync => {
  return async (fastify: FastifyInstance) => {
    fastify.addHook('preHandler', async (request: FastifyRequest, reply: FastifyReply) => {
      await validateRequestBody(request, reply, authCredentialsBodySchema);
    });
    fastify.post(
      '/',
      { config: authRateLimit },
      controller.loginCredentialsHandler.bind(controller)
    );
  };
};

const loginWithGoogle = (controller: AuthController): FastifyPluginAsync => {
  return async (fastify: FastifyInstance) => {
    fastify.addHook('preHandler', async (request, reply) => {
      await validateRequestBody(request, reply, oauthCodeBodySchema);
    });
    fastify.post('/', controller.loginGoogleHandler.bind(controller));
  };
};

const loginWithGithub = (controller: AuthController): FastifyPluginAsync => {
  return async (fastify: FastifyInstance) => {
    fastify.addHook('preHandler', async (request, reply) => {
      await validateRequestBody(request, reply, oauthCodeBodySchema);
    });
    fastify.post('/', controller.loginGithubHandler.bind(controller));
  };
};

const loginWithGitlab = (controller: AuthController): FastifyPluginAsync => {
  return async (fastify: FastifyInstance) => {
    fastify.addHook('preHandler', async (request, reply) => {
      await validateRequestBody(request, reply, oauthCodeBodySchema);
    });
    fastify.post('/', controller.loginGitlabHandler.bind(controller));
  };
};

const loginWithDiscord = (controller: AuthController): FastifyPluginAsync => {
  return async (fastify: FastifyInstance) => {
    fastify.addHook('preHandler', async (request, reply) => {
      await validateRequestBody(request, reply, oauthCodeBodySchema);
    });
    fastify.post('/', controller.loginDiscordHandler.bind(controller));
  };
};

const registerWithCredentials = (controller: AuthController): FastifyPluginAsync => {
  return async (fastify: FastifyInstance): Promise<void> => {
    fastify.addHook('preHandler', async (request, reply) => {
      await validateRequestBody(request, reply, authCredentialsBodySchema);
    });
    fastify.post(
      '/',
      { config: authRateLimit },
      controller.registerCredentialsHandler.bind(controller)
    );
  };
};

const logout = (controller: AuthController): FastifyPluginAsync => {
  return async (fastify: FastifyInstance) => {
    fastify.addHook('preHandler', async (request, reply) => {
      await fastify.verifySameOrigin(request, reply);
      if (reply.sent) return;
      await fastify.verifyAccessTokenHeader(request, reply);
    });
    fastify.post('/', {}, controller.logout.bind(controller));
  };
};

const logoutAll = (controller: AuthController): FastifyPluginAsync => {
  return async (fastify: FastifyInstance) => {
    fastify.addHook('preHandler', async (request, reply) => {
      await fastify.verifySameOrigin(request, reply);
      if (reply.sent) return;
      await fastify.verifyAccessTokenHeader(request, reply);
    });
    fastify.post('/', {}, controller.logoutAllDevices.bind(controller));
  };
};

const confirmEmail = (controller: AuthController): FastifyPluginAsync => {
  return async (fastify: FastifyInstance) => {
    fastify.addHook('preHandler', async (request, reply) => {
      await validateRequestQuery(request, reply, verifyEmailQueryStringSchema);
    });
    fastify.get('/', controller.confirmEmailHandler.bind(controller));
  };
};

const forgotPassword = (controller: AuthController): FastifyPluginAsync => {
  return async (fastify: FastifyInstance) => {
    fastify.addHook('preHandler', async (request, reply) => {
      await validateRequestBody(request, reply, forgotPasswordRequestSchema);
    });
    fastify.post('/', { config: authRateLimit }, controller.forgotPasswordHandler.bind(controller));
  };
};

const resetPassword = (controller: AuthController): FastifyPluginAsync => {
  return async (fastify: FastifyInstance) => {
    fastify.addHook('onRequest', async (request, reply) => {
      await fastify.verifyResetPasswordCookie(request, reply);
    });
    fastify.addHook('preHandler', async (request, reply) => {
      await validateRequestQuery(request, reply, verifyEmailQueryStringSchema);
      if (reply.sent) return;
      await validateRequestBody(request, reply, resetPasswordRequestSchema);
    });
    fastify.post('/', { config: authRateLimit }, controller.resetPasswordHandler.bind(controller));
  };
};

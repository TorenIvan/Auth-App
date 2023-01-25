import { FastifyInstance, FastifyPluginAsync } from "fastify";
import loginWithCredentials from "./modules/credentials.login";
import loginWithFacebook from "./modules/facebook.login";
import loginWithGithub from "./modules/github.login";
import loginWithGoogle from "./modules/google.login";
import loginWithTwitter from "./modules/twitter.login";

/**
 * Encapsulates the login routes
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 */
const login: FastifyPluginAsync = async (
  fastify: FastifyInstance
): Promise<void> => {
  fastify
    .register(loginWithCredentials, { prefix: "/credentials" })
    .register(loginWithFacebook, { prefix: "/facebook" })
    .register(loginWithTwitter, { prefix: "/twitter" })
    .register(loginWithGithub, { prefix: "/github" })
    .register(loginWithGoogle, { prefix: "/google" });
};

export default login;

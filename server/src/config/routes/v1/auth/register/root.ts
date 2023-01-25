import { FastifyInstance, FastifyPluginAsync } from "fastify";
import registerWithCredentials from "./modules/credentials.register";
import registerWithFacebook from "./modules/facebook.register";
import registerWithGithub from "./modules/github.register";
import registerWithGoogle from "./modules/google.register";
import registerWithTwitter from "./modules/twitter.register";

/**
 * Encapsulates the register routes
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 */
const register: FastifyPluginAsync = async (
  fastify: FastifyInstance
): Promise<void> => {
  fastify
    .register(registerWithCredentials, { prefix: "/credentials" })
    .register(registerWithFacebook, { prefix: "/facebook" })
    .register(registerWithTwitter, { prefix: "/twitter" })
    .register(registerWithGithub, { prefix: "/github" })
    .register(registerWithGoogle, { prefix: "/google" });
};

export default register;

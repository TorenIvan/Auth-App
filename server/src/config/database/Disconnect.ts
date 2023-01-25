import { FastifyInstance, FastifyPluginAsync } from "fastify";
import { EnvironmentVariables } from "../utils/constants/EnvironmentVariables";

/**
 * Encapsulates DataBase disconnect operation, adding functionality on close using fastify hook
 * @param {FastifyInstance} fastify Encapsulated Fastify Instance
 * @param {object} options plugin options, refer to https://www.fastify.io/docs/latest/Reference/Plugins/#plugin-options
 */

const databaseDisconnect: FastifyPluginAsync = async (
  fastify: FastifyInstance,
  options: object
): Promise<void> => {
  fastify.addHook("onClose", async () => {
    console.error(EnvironmentVariables.CloseDB);
  });
};

export default databaseDisconnect;

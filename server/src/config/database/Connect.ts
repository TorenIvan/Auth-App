import fastifyMongodb from "@fastify/mongodb";
import { FastifyInstance, FastifyPluginAsync } from "fastify";
import { EnvironmentVariables } from "../utils/constants/EnvironmentVariables";

/**
 * Encapsulates DataBase connect operation
 * @param {FastifyInstance} fastify Encapsulated Fastify Instance
 * @param {object} options plugin options, refer to https://www.fastify.io/docs/latest/Reference/Plugins/#plugin-options
 */

const databaseConnect: FastifyPluginAsync = async (
  fastify: FastifyInstance,
  options: object
): Promise<void> => {
  fastify.register(fastifyMongodb, {
    forceClose: true,
    url: EnvironmentVariables.DatabaseUri,
  });
};

export default databaseConnect;

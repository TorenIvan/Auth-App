import fastifyMongodb from "@fastify/mongodb";
import { FastifyInstance, FastifyPluginAsync as FPA } from "fastify";
import { EnvironmentVariables } from "../utils/constants/EnvironmentVariables";

/**
 * Encapsulates DataBase connect operation
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 * @param {Object} options plugin options, refer to https://www.fastify.io/docs/latest/Reference/Plugins/#plugin-options
 */

const databaseConnect: FPA = async (
  fastify: FastifyInstance,
  options: object
): Promise<void> => {
  fastify.register(fastifyMongodb, {
    forceClose: true,
    url: EnvironmentVariables.DatabaseUri,
  });
};

export default databaseConnect;

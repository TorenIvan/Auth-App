import fastifyMongodb from "@fastify/mongodb";
import { FastifyPluginAsync as fpa } from "fastify";
import { EnvironmentVariables } from "../constants/EnvironmentVariables";

const databaseConnect: fpa = async (fastify, opts): Promise<void> => {
  fastify.register(fastifyMongodb, {
    forceClose: true,
    url: EnvironmentVariables.DatabaseUri,
  });
};

export default databaseConnect;

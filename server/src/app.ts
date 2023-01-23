import { join } from "path";
import AutoLoad, { AutoloadPluginOptions } from "@fastify/autoload";
import { FastifyPluginAsync } from "fastify";
import { config } from "dotenv";

export type AppOptions = {
  // Place your custom options for app below here.
} & Partial<AutoloadPluginOptions>;

const app: FastifyPluginAsync<AppOptions> = async (
  fastify,
  options
): Promise<void> => {
  // Place here your custom code!

  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application

  config({ path: `../env.${process.env.NODE_ENV}` });

  void fastify.register(AutoLoad, {
    dir: join(__dirname, "./config/database"),
    options: options,
  });

  void fastify.register(AutoLoad, {
    dir: join(__dirname, "./config/plugins"),
    options: options,
  });

  // This loads all plugins defined in routes
  // define your routes in one of these
  void fastify.register(AutoLoad, {
    dir: join(__dirname, "./config/routes"),
    options: options,
  });
};

export default app;

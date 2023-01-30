import { join, resolve } from "path";
import AutoLoad, { AutoloadPluginOptions } from "@fastify/autoload";
import FastifyOverview from "fastify-overview";
import { FastifyPluginAsync } from "fastify";
import { config } from "dotenv";
import { registerCredentialsSchema } from "./api/v1/user/user.schema";
import routes from "./config/routes";

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

  config({ path: resolve(__dirname, `../.env.${process.env.NODE_ENV}`) });

  if (process.env.NODE_ENV === "development") {
    await fastify.register(FastifyOverview);
  }

  void fastify.register(AutoLoad, {
    dir: join(__dirname, "./config/utils"),
    options: options,
  });

  void fastify.register(AutoLoad, {
    dir: join(__dirname, "./config/database"),
  });

  void fastify.register(AutoLoad, {
    dir: join(__dirname, "./config/plugins"),
    options: options,
  });

  for (const schema of registerCredentialsSchema) {
    fastify.addSchema(schema);
  }

  // This loads all plugins defined in routes
  // define your routes in one of these
  void fastify.register(routes, options);

  if (process.env.NODE_ENV === "development") {
    fastify.addHook("onReady", async function showStructure() {
      const fastifyStructure = fastify.overview({ hideEmpty: true });
      console.log(JSON.stringify(fastifyStructure));
    });
  }
};

export default app;

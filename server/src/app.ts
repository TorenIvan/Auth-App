import { join, resolve } from "path";
import AutoLoad, { AutoloadPluginOptions } from "@fastify/autoload";
import FastifyOverview from "fastify-overview";
import { FastifyPluginAsync } from "fastify";
import { config } from "dotenv";
config({ path: resolve(__dirname, `../.env.${process.env.NODE_ENV}`) });
import { registerCredentialsSchema } from "./api/v1/user/user.schema";
import cookie from "@fastify/cookie";
import type { FastifyCookieOptions } from "@fastify/cookie";
import cors from "@fastify/cors";
import routes from "./config/routes";
import userMiddleware from "./api/v1/user/user.middleware";

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

  if (process.env.NODE_ENV === "development") {
    await fastify.register(FastifyOverview);
  }

  console.log("env: ", process.env.CLIENT_URI);
  await fastify.register(cors, {
    origin: "http://localhost:5173",
    methods: ["GET", "PUT", "POST", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      process.env.COOKIE_NAME!,
      process.env.RESET_PASS_COOKIE_NAME!,
    ],
    credentials: true,
    exposedHeaders: ["*", "Authorization"],
  });

  void fastify.register(cookie, {
    hook: "onRequest",
    parseOptions: {},
  } as FastifyCookieOptions);

  void fastify.register(AutoLoad, {
    dir: join(__dirname, "./config/database"),
  });

  void fastify.register(AutoLoad, {
    dir: join(__dirname, "./config/utils"),
    options: options,
  });

  void fastify.register(AutoLoad, {
    dir: join(__dirname, "./config/plugins"),
    options: options,
  });

  for (const schema of registerCredentialsSchema) {
    fastify.addSchema(schema);
  }

  void fastify.register(userMiddleware);
  void fastify.register(routes, options);

  if (process.env.NODE_ENV === "development") {
    fastify.addHook("onReady", async function showStructure() {
      // const fastifyStructure = fastify.overview({ hideEmpty: true });
      // console.log(JSON.stringify(fastifyStructure));
    });
  }
};

export default app;

import { join, resolve } from "path";
import AutoLoad, { AutoloadPluginOptions } from "@fastify/autoload";
import FastifyOverview from "fastify-overview";
import { FastifyPluginAsync } from "fastify";
import { config } from "dotenv";
config({ path: resolve(__dirname, `../.env.${process.env.NODE_ENV}`) });
import cookie from "@fastify/cookie";
import type { FastifyCookieOptions } from "@fastify/cookie";
import cors from "@fastify/cors";
import multipart from "@fastify/multipart";
import { userRoutes } from "./api/v1/user";
import { authMiddleware } from "./config/middleware";

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

  await fastify.register(multipart, {
    addToBody: true,
  });
  await fastify.register(cors, {
    origin: process.env.CLIENT_URI,
    methods: ["GET", "PUT", "POST", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      process.env.COOKIE_NAME!,
      process.env.RESET_PASS_COOKIE_NAME!,
    ],
    credentials: true,
    exposedHeaders: [
      "Content-Type",
      "Authorization",
      process.env.COOKIE_NAME!,
      process.env.RESET_PASS_COOKIE_NAME!,
    ],
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

  void fastify.register(authMiddleware);
  void fastify.register(userRoutes, options);

  if (process.env.NODE_ENV === "development") {
    fastify.addHook("onReady", async function showStructure() {
      // const fastifyStructure = fastify.overview({ hideEmpty: true });
    });
  }
};

export default app;

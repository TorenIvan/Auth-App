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
import { userRoutes } from "./modules/user/v1";
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

  // Define the OAuth2 options
  //  const oauth2OptionsFacebook: FastifyOAuth2Options = {
  //    name: "facebookOAuth2",
  //    credentials: {
  //      client: {
  //        id: process.env.FACEBOOK_APP_ID!,
  //        secret: process.env.FACEBOOK_APP_SECRET!,
  //      },
  //      auth: fastifyOAuth2.FACEBOOK_CONFIGURATION,
  //    },
  //    // Register a Fastify URL to start the redirect flow
  //    startRedirectPath: "/login/facebook",
  //    // facebook redirect here after the user login
  //    callbackUri: "https://localhost:3000/v1/auth/login/facebook",
  //  };

  //void fastify.register(fastifyOAuth2, oauth2OptionsFacebook);

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

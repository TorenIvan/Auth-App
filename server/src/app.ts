import { join, resolve } from "path";
import AutoLoad, { AutoloadPluginOptions } from "@fastify/autoload";
import FastifyOverview from "fastify-overview";
import { FastifyPluginAsync } from "fastify";
import { config } from "dotenv";
import cookie from "@fastify/cookie";
import type { FastifyCookieOptions } from "@fastify/cookie";
import cors from "@fastify/cors";
import multipart from "@fastify/multipart";

config({ path: resolve(__dirname, `../.env.${process.env.NODE_ENV}`) });

import { userRoutesV1 } from "./modules/user/v1";
import { authMiddleware, userMiddleware } from "./config/middleware";
import { DIPlugin } from "./config/plugins/di.plugin";
import databasePlugin from "./config/plugins/database.plugin";
import fastifySensible from "@fastify/sensible";
import loggerPlugin from "./config/plugins/logger.plugin";
import httpErrorPlugin from "./config/plugins/httpError.plugin";
import notFoundPlugin from "./config/plugins/notFound.plugin";
import { authRoutesV1 } from "./modules/auth/v1";

export type AppOptions = {
  // Place your custom options for app below here.
  https: {
    key: "../key.pem";
    cert: "../cert.pem";
  };
} & Partial<AutoloadPluginOptions>;

const app: FastifyPluginAsync<AppOptions> = async (
  fastify,
  options
): Promise<void> => {
  // Place here your custom code!
  // const { key, cert } = options.https;
  // await fastify.register(require("fastify-https"), {
  //   key: fs.readFileSync(key),
  //   cert: fs.readFileSync(cert),
  // });

  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application

  if (process.env.NODE_ENV === "development") {
    await fastify.register(FastifyOverview);
  }

  await fastify.register(multipart, {
    addToBody: true,
    limits: {
      fileSize: 16 * 1024 * 1024, 
      files: 1, 
    }
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

  await fastify.register(databasePlugin, options)
  await fastify.register(AutoLoad, {
    dir: join(__dirname, "./config/utils"),
    options: options,
  });
  await fastify.register(fastifySensible);
  await fastify.register(loggerPlugin);
  await fastify.register(DIPlugin, options);
  await fastify.register(authMiddleware, options);
  await fastify.register(userMiddleware, options);
  await fastify.register(authRoutesV1(fastify.controllers.auth), options);
  await fastify.register(userRoutesV1(fastify.controllers.user), options);
  await fastify.register(httpErrorPlugin, options);
  await fastify.register(notFoundPlugin, options);

  if (process.env.NODE_ENV === "development") {
    fastify.addHook("onReady", async function showStructure() {
    });
  }
};

export default app;

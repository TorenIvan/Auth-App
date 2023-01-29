import * as z from "zod";
import { buildJsonSchemas } from "fastify-zod";

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,36}$/),
});

const headersSchema = z.object({
  "Content-Type": z.string(),
});

const responseSchema = z.object({
  200: z.object({
    access_token: z.string(),
  }),
  201: z.object({
    access_token: z.string(),
  }),
});

export const credentialsRegisterSchema = buildJsonSchemas({
  body: bodySchema,
  headers: headersSchema,
  response: responseSchema,
});

import * as z from "zod";
import { buildJsonSchemas } from "fastify-zod";
import { Strings } from "../../../config/utils/constants/Strings";

const authCredsBodySchema = z.object({
  email: z
    .string({
      required_error: Strings.EmailRequired,
      invalid_type_error: Strings.EmailInvalid,
    })
    .email(),
  password: z
    .string({
      required_error: Strings.PasswordRequired,
      invalid_type_error: Strings.PasswordInvalid,
    })
    .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,36}$/),
});

const registerUserResponseSchema = z.object({
  access_token: z.string(),
});

export type credsUserInput = z.infer<typeof authCredsBodySchema>;

export const { schemas: registerCredentialsSchema, $ref } = buildJsonSchemas({
  authCredsBodySchema,
  registerUserResponseSchema,
});

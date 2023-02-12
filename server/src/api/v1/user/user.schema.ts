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

const authCredsUserResponseSchema = z.object({
  access_token: z.string(),
});

const verifyEmailQueryStringSchema = z.object({
  token: z.string().min(1, { message: "token is required" }),
});

const verifyEmailResponseSchema = z.object({
  message: z.string(),
});

const verifyEmailErrorSchema = z.object({
  error: z.string(),
});

const forgotPasswordRequestSchema = z.object({
  email: z.string(),
});

const resetPasswordRequestSchema = z.object({
  newPassword: z
    .string({
      required_error: Strings.PasswordRequired,
      invalid_type_error: Strings.PasswordInvalid,
    })
    .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,36}$/),
  confirmNewPassword: z
    .string({
      required_error: Strings.PasswordRequired,
      invalid_type_error: Strings.PasswordInvalid,
    })
    .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,36}$/),
});

export type credsUserInput = z.infer<typeof authCredsBodySchema>;
export type forgotPasswordInput = z.infer<typeof forgotPasswordRequestSchema>;
export type resetPasswordUserInput = z.infer<typeof resetPasswordRequestSchema>;
export type queryConfirmEmail = z.infer<typeof verifyEmailQueryStringSchema>;

export const { schemas: registerCredentialsSchema, $ref } = buildJsonSchemas({
  authCredsBodySchema,
  authCredsUserResponseSchema,
  verifyEmailQueryStringSchema,
  verifyEmailResponseSchema,
  verifyEmailErrorSchema,
  forgotPasswordRequestSchema,
  resetPasswordRequestSchema,
});

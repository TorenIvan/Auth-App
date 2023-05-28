import * as z from "zod";
import { buildJsonSchemas } from "fastify-zod";
import { Errors } from "../../../config/utils/constants/Errors";

export const authCredsBodySchema = z.object({
  email: z
    .string({
      required_error: Errors.EmailRequired,
      invalid_type_error: Errors.EmailInvalid,
    })
    .email(),
  password: z
    .string({
      required_error: Errors.PasswordRequired,
      invalid_type_error: Errors.PasswordInvalid,
    })
    .refine(
      (value) => /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,36}$/.test(value),
      {
        message: Errors.PasswordInvalid,
      }
    ),
});

export const authCredsUserResponseSchema = z.object({
  access_token: z.string(),
});

const verifyEmailQueryStringSchema = z.object({
  token: z.string().min(1, { message: Errors.TokenRequired }),
});

const verifyEmailResponseSchema = z.object({
  message: z.string(),
});

const verifyEmailErrorSchema = z.object({
  error: z.string(),
});

const forgotPasswordRequestSchema = z.object({
  email: z
    .string({
      required_error: Errors.EmailRequired,
      invalid_type_error: Errors.EmailInvalid,
    })
    .email(),
});

const resetPasswordRequestSchema = z.object({
  newPassword: z
    .string({
      required_error: Errors.PasswordRequired,
      invalid_type_error: Errors.PasswordInvalid,
    })
    .refine(
      (value) => /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,36}$/.test(value),
      {
        message: Errors.PasswordInvalid,
      }
    ),
  confirmNewPassword: z
    .string({
      required_error: Errors.PasswordRequired,
      invalid_type_error: Errors.PasswordInvalid,
    })
    .refine(
      (value) => /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,36}$/.test(value),
      {
        message: Errors.PasswordInvalid,
      }
    ),
});

const userDetailsResponseSchema = z.object({
  username: z
    .string()
    .trim()
    .min(2, { message: Errors.UsernameMinimum })
    .max(18, { message: Errors.UsernameMaximum }),
  email: z.string().email(),
  phone: z
    .string()
    .length(0)
    .or(
      z
        .string()
        .regex(
          /(\+\d{1,3}\s?)?((\(\d{3}\)\s?)|(\d{3})(\s|-?))(\d{3}(\s|-?))(\d{4})(\s?(([E|e]xt[:|.|]?)|x|X)(\s?\d+))?/g
        )
    ),
  biography: z.string(),
  signInMethod: z.string(),
});

export const userEditRequestBodySchema = z.object({
  username: z
    .string()
    .trim()
    .min(2, { message: Errors.UsernameMinimum })
    .max(18, { message: Errors.UsernameMaximum }),
  biography: z.string().trim(),
  phone: z
    .string()
    .length(0)
    .or(
      z
        .string()
        .regex(
          /(\+\d{1,3}\s?)?((\(\d{3}\)\s?)|(\d{3})(\s|-?))(\d{3}(\s|-?))(\d{4})(\s?(([E|e]xt[:|.|]?)|x|X)(\s?\d+))?/g
        )
    ),
  currentPassword: z
    .string({
      invalid_type_error: Errors.PasswordInvalid,
    })
    .refine(
      (value) => /^(?=.?[A-Z])(?=.?[a-z])(?=.*?[0-9]).{8,36}$|^$/.test(value),
      {
        message: Errors.PasswordInvalid,
      }
    ),
  newPassword: z
    .string({
      invalid_type_error: Errors.PasswordInvalid,
    })
    .refine(
      (value) => /^(?=.?[A-Z])(?=.?[a-z])(?=.*?[0-9]).{8,36}$|^$/.test(value),
      {
        message: Errors.PasswordInvalid,
      }
    ),
});

export type credsUserInput = z.infer<typeof authCredsBodySchema>;
export type forgotPasswordInput = z.infer<typeof forgotPasswordRequestSchema>;
export type resetPasswordUserInput = z.infer<typeof resetPasswordRequestSchema>;
export type queryConfirmEmail = z.infer<typeof verifyEmailQueryStringSchema>;
export type editUserDetailsBody = z.infer<typeof userEditRequestBodySchema>;

export const { schemas: userSchemas, $ref } = buildJsonSchemas({
  authCredsBodySchema,
  authCredsUserResponseSchema,
  verifyEmailQueryStringSchema,
  verifyEmailResponseSchema,
  verifyEmailErrorSchema,
  forgotPasswordRequestSchema,
  resetPasswordRequestSchema,
  userDetailsResponseSchema,
  userEditRequestBodySchema,
});

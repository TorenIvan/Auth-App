import * as z from 'zod';
import { Errors } from '../../../config/utils/constants/Errors';

export const authCredentialsBodySchema = z.object({
  email: z
    .string({
      error: (issue) => (issue.input === undefined ? Errors.EmailRequired : Errors.EmailInvalid),
    })
    .trim()
    .email({ message: Errors.EmailInvalid }),
  password: z
    .string({
      error: (issue) =>
        issue.input === undefined ? Errors.PasswordRequired : Errors.PasswordInvalid,
    })
    .trim()
    .refine((value) => /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,36}$/.test(value), {
      message: Errors.PasswordInvalid,
    }),
});

export const verifyEmailQueryStringSchema = z.object({
  email: z.string().trim().email(),
  token: z.string().min(1, { message: Errors.TokenRequired }),
});

export const forgotPasswordRequestSchema = z.object({
  email: z
    .string({
      error: (issue) => (issue.input === undefined ? Errors.EmailRequired : Errors.EmailInvalid),
    })
    .trim()
    .email({ message: Errors.EmailInvalid }),
});

export const resetPasswordRequestSchema = z.object({
  newPassword: z
    .string({
      error: (issue) =>
        issue.input === undefined ? Errors.PasswordRequired : Errors.PasswordInvalid,
    })
    .trim()
    .refine((value) => /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,36}$/.test(value), {
      message: Errors.PasswordInvalid,
    }),
  confirmNewPassword: z
    .string({
      error: (issue) =>
        issue.input === undefined ? Errors.PasswordRequired : Errors.PasswordInvalid,
    })
    .trim()
    .refine((value) => /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,36}$/.test(value), {
      message: Errors.PasswordInvalid,
    }),
});

export const oauthCodeBodySchema = z.object({
  code: z.string().min(1).max(2048),
});

export type credentialsUserInput = z.infer<typeof authCredentialsBodySchema>;
export type forgotPasswordInput = z.infer<typeof forgotPasswordRequestSchema>;
export type resetPasswordUserInput = z.infer<typeof resetPasswordRequestSchema>;
export type queryConfirmEmail = z.infer<typeof verifyEmailQueryStringSchema>;
export type oauthCodeInput = z.infer<typeof oauthCodeBodySchema>;

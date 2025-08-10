import * as z from "zod";
import { Errors } from "../../../config/utils/constants/Errors";

export const authCredentialsBodySchema = z.object({
  email: z
    .string({
      required_error: Errors.EmailRequired,
      invalid_type_error: Errors.EmailInvalid,
    })
    .email({ message: Errors.EmailInvalid }),
  password: z
    .string({
      required_error: Errors.PasswordRequired,
      invalid_type_error: Errors.PasswordInvalid,
    })
    .trim()
    .refine(
      (value) => /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,36}$/.test(value),
      {
        message: Errors.PasswordInvalid,
      }
    ),
});

export const verifyEmailQueryStringSchema = z.object({
  email: z.string().email(),
  token: z.string().min(1, { message: Errors.TokenRequired }),
});

export const forgotPasswordRequestSchema = z.object({
  email: z
    .string({
      required_error: Errors.EmailRequired,
      invalid_type_error: Errors.EmailInvalid,
    })
    .email({ message: Errors.EmailInvalid }),
});

export const resetPasswordRequestSchema = z.object({
  newPassword: z
    .string({
      required_error: Errors.PasswordRequired,
      invalid_type_error: Errors.PasswordInvalid,
    })
    .trim()
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
    .trim()
    .refine(
      (value) => /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,36}$/.test(value),
      {
        message: Errors.PasswordInvalid,
      }
    ),
});

export const userEditRequestBodySchema = z.object({
  username: z
    .string()
    .trim()
    .min(2, { message: Errors.UsernameMinimum })
    .max(18, { message: Errors.UsernameMaximum }),
  biography: z.string().trim().max(500, { message: Errors.biographyMaximum }),
  phone: z
    .string()
    .refine(
      (value) =>
        /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$|^$/.test(value),
      {
        message: Errors.InvalidPhoneNumber,
      }
    ),
  currentPassword: z
    .string({
      invalid_type_error: Errors.PasswordInvalid,
    })
    .trim()
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
    .trim()
    .refine(
      (value) => /^(?=.?[A-Z])(?=.?[a-z])(?=.*?[0-9]).{8,36}$|^$/.test(value),
      {
        message: Errors.PasswordInvalid,
      }
    ),
  file: z.unknown().optional(),
});

export type credentialsUserInput = z.infer<typeof authCredentialsBodySchema>;
export type forgotPasswordInput = z.infer<typeof forgotPasswordRequestSchema>;
export type resetPasswordUserInput = z.infer<typeof resetPasswordRequestSchema>;
export type queryConfirmEmail = z.infer<typeof verifyEmailQueryStringSchema>;
export type editUserDetailsBody = z.infer<typeof userEditRequestBodySchema>;

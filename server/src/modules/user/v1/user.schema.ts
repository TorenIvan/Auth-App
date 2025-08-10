import * as z from "zod";
import { Errors } from "../../../config/utils/constants/Errors";

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

export type editUserDetailsBody = z.infer<typeof userEditRequestBodySchema>;

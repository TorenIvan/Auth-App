import * as z from "zod";
import { ObjectId } from "mongodb";
import { ImageSchema } from "../image/image.model";
import { Errors } from "../../../config/utils/constants/Errors";

const UserSchema = z.object({
  _id: z.instanceof(ObjectId),
  schemaVersion: z.number(),
  username: z.string(),
  email: z.string().email(),
  phone: z
    .string()
    .refine(
      (value) =>
        /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$|^$/.test(value),
      {
        message: Errors.InvalidPhoneNumber,
      }
    ),
  biography: z.string(),
  password: z.string().optional(),
  signInMethod: z.string(),
  isVerified: z.boolean(),
  image: z.union([ImageSchema, z.undefined()]),
});

type User = z.infer<typeof UserSchema>;

export default User;

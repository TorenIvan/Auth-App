import * as z from "zod";

const UserSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  phone: z
    .string()
    .optional()
    .or(
      z
        .string()
        .regex(
          /(\+\d{1,3}\s?)?((\(\d{3}\)\s?)|(\d{3})(\s|-?))(\d{3}(\s|-?))(\d{4})(\s?(([E|e]xt[:|.|]?)|x|X)(\s?\d+))?/g
        )
    ),
  biography: z.string().optional(),
  password: z.string().optional(),
  signInMethod: z.string(),
});

type User = z.infer<typeof UserSchema>;

export default User;

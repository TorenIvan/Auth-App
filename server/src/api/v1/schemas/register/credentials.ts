import * as z from "zod";

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,36}$/)
});

const headersSchema = z.object({
  "Content-Type": z.string(),
});

const responseSchema = z.object({});

export const credentialsRegisterSchema = {
  body: bodySchema,
  headers: headersSchema,
  response: responseSchema,
};

import * as z from "zod";

export const ImageSchema = z.object({
  filename: z.string(),
  mimetype: z.string(),
  size: z.number(),
  data: z.string().refine((value) => Buffer.from(value, "base64")),
});

type Image = z.infer<typeof ImageSchema>;

export default Image;

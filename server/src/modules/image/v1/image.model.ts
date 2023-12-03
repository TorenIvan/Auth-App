import * as z from "zod";

export const ImageSchema = z.object({
  filename: z.string(),
  mimetype: z.string(),
  encoding: z.string(),
  data: z.instanceof(Buffer),
});

type Image = z.infer<typeof ImageSchema>;

export default Image;

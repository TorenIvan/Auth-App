import * as z from "zod";
import { ObjectId } from "mongodb";

export const ImageSchema = z.object({
  _id: z.instanceof(ObjectId),
  schemaVersion: z.number(),
  filename: z.string(),
  mimetype: z.string(),
  encoding: z.string(),
  data: z.instanceof(Buffer),
});

type Image = z.infer<typeof ImageSchema>;

export default Image;

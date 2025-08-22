import * as z from 'zod';
import { ObjectId } from 'mongodb';

export const RefreshTokenSchema = z.object({
  _id: z.instanceof(ObjectId),
  token: z.string(),
  createdAt: z.date(),
  revoked: z.boolean().default(false),
  ip: z.string().optional(),
  userAgent: z.string().optional(),
});

import * as z from 'zod';
import { ObjectId } from 'mongodb';

export const RefreshTokenSchema = z.object({
  _id: z.instanceof(ObjectId),
  userId: z.instanceof(ObjectId),
  token: z.string(),
  createdAt: z.date(),
  expiresAt: z.date(),
  revoked: z.boolean().default(false),
  revokedAt: z.date().optional(),
  deleteAt: z.date().optional(), // auto-delete date (after revoked)
  ip: z.string().optional(),
  userAgent: z.string().optional(),
});

type RefreshToken = z.infer<typeof RefreshTokenSchema>;

export default RefreshToken;

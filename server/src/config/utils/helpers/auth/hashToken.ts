import { createHash } from 'crypto';

/**
 * @description Refresh tokens are stored hashed, so a database leak does not expose live tokens.
 */
export const hashToken = (token: string): string => {
  return createHash('sha256').update(token).digest('hex');
};

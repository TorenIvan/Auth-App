export function generateCsrfToken(length: number = 32): string {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  // Cryptographically secure randomness (Math.random is predictable)
  const randomValues = crypto.getRandomValues(new Uint32Array(length));
  let token = '';

  for (let i = 0; i < length; i++) {
    token += charset.charAt(randomValues[i] % charset.length);
  }

  return token;
}

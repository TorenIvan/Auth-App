import '@tanstack/react-query';

/**
 * *** Our api functions throw plain strings (Errors.X), not Error objects ***
 */
declare module '@tanstack/react-query' {
  interface Register {
    defaultError: unknown;
  }
}

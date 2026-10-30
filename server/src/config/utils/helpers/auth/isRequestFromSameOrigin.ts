import { FastifyRequest } from 'fastify';

/**
 * @description CSRF defense in depth for the routes that read the refresh token cookie.
 * Browsers always send Sec-Fetch-Site and scripts cannot forge it. Requests without it
 * (non-browser clients such as curl) are not a CSRF vector, so they are allowed.
 */
export const isRequestFromSameOrigin = (request: FastifyRequest): boolean => {
  const fetchSite = request.headers['sec-fetch-site'];
  if (fetchSite === undefined) {
    return true;
  }
  return fetchSite === 'same-origin';
};

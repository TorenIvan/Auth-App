export function extractCSRFToken(state: string | null | undefined): string | undefined {
  if (!state) return undefined;
  return decodeURIComponent(state);
}

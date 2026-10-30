export type AuthEvent = 'login' | 'logout';

/**
 * *** One channel per tab for the whole app: a login or logout in one tab is mirrored in the others ***
 * A tab never receives its own messages, so the sender handles its own state.
 */
export const authChannel: BroadcastChannel | null =
  typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('auth') : null;

export function broadcastAuthEvent(event: AuthEvent): void {
  authChannel?.postMessage(event);
}

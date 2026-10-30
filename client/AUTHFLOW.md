# Auth Flow

This file describes the authentication layer flow of the application.

Access token: in memory, stateless (verified by signature only).
Refresh token: httpOnly cookie, stateful (one session document per login, stored hashed).

## Structure

- **AxiosInterceptor**
  A wrapper around the app that:
  - Attaches a Response Interceptor to axiosInstance
  - On a 401: refreshes once, queues the other failed requests and retries all of them with their own headers
  - Ends the session only when the refresh answers 401/403 (offline, timeouts and 5xx just fail the request)
  - Listens to the auth channel: a logout in another tab clears this tab, a login re-checks the auth status

- **renewTokens**
  - `POST /api/v1/auth/refresh` (rotation changes state)
  - Wrapped in `navigator.locks.request('auth-refresh')`: tabs share the cookie, so they refresh one at a time
  - 20s timeout, so a hung refresh never blocks the lock

- **authChannel** (native BroadcastChannel)
  - The tab that logs in/out posts `'login'`/`'logout'`; the other tabs only update their local state
  - No duplicate logout requests: only the sender calls the server

- **AuthGuard**

  **Public routes:**
  - If `isAuthenticating === true` → Show loading state
  - If `isAuthenticated === true` → Redirect to `/profile`
  - If `isAuthenticated === false` → Render normally

  **Protected routes:**
  - If `isAuthenticating === true` → Show loading state
  - If `isAuthenticated === false` → Redirect to `/login`
  - If `isAuthenticated === true` → Render normally

- **React Query Hooks**
  - Encapsulate API logic with loading/error states:
      - useLoginMutation → Calls loginUser, sets token, sets ['auth','status'] = true, broadcasts `'login'`
      - useLogoutMutation → Calls logoutUser, clears headers, cancels queries, sets ['auth','status'] = false, broadcasts `'logout'`
      - useLogoutAllMutation → Same as logout, but the server revokes every session of the user
      - useCheckIfUserIsAuthenticatedQuery → `GET /check` (read-only, never rotates), used by AuthGuard

## Server side (what the client relies on)

- Every login creates a session; its id is the `sid` claim of both tokens
- Rotation is atomic: the presented token must be the current one, or the previous one within 10 seconds
  (a response lost during a reload). Any other token of the session is a reuse → the session is revoked
- Cookies: `HttpOnly; Secure; SameSite=Strict; Path=/api/v1/auth`, Max-Age from the token's `exp`
- Routes that read the cookie reject `Sec-Fetch-Site` other than `same-origin`

| Scenario | Result |
|---|---|
| Several tabs expire at the same time | Refreshes run one after another (Web Lock), nobody is logged out |
| Reload while a refresh is in flight (<10s) | The previous token is accepted once more |
| Lost refresh response and coming back after >10s | Logged out, no theft is reported |
| Thief refreshes before or after the victim | The next use of the other token revokes the session |
| Thief uses the token within the 10s window | Detected on the victim's next refresh (inherent limit of rotation) |
| A tab closes mid-refresh and the server reorders requests | Rare false logout (documented, not worked around) |

## Flow
      [Page load]
            |
            v
      [AuthGuard → GET /check]  (access token? no, it is gone after a reload → the cookie is checked)
            |
       Authenticated? ---- No ----> [Redirect to Login]
            |
           Yes
            v
      [Render Component]

  -----------------------------------------------------

      [Component makes API call via Axios]
            |
      [Axios adds Authorization header if present]
            |
      [Server validates the access token (signature only)]
            |
      401 Unauthorized?
            |
      ---- No ----> [API Response → Update UI]
            |
           Yes
            v
      [Already refreshing?] ---- Yes ----> [Wait in the queue]
            |
           No
            v
      [Web Lock → POST /refresh → rotated cookie + new access token]
            |
      Refresh success? ---- No (401/403) ----> [Logout this tab + broadcast 'logout']
            |               ---- No (network) ---> [Fail only this request]
           Yes
            v
      [Retry the original request (and the queued ones) with the new token]
            |
            v
      [API Response]

## Limits (stated on purpose)

- An XSS on the page runs same-origin: it can call the API and the refresh endpoint like the app does.
  Keeping the access token in memory limits how long a stolen token is useful, it does not prevent XSS.
- A stolen access token stays valid until it expires, also after logout or "logout all devices".
  Short access token lifetimes keep that window small.

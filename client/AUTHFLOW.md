# Auth Flow

This file describes the authentication layer flow of the application.

## Structure

- **AxiosInterceptor**  
  A wrapper around the app that:
  - Attaches a Response Interceptor to axiosInstance
  - Handles token expiration and refresh queueing
  - Updates React Query’s auth state (['auth', 'status']) on success/failure

- **AxiosConfig**  
  - Request Interceptor (default header injection):
      - Adds Authorization: Bearer <accessToken> if present
  - Response Interceptor (in AxiosInterceptor):
      - If already refreshing → queues the failed request until a new token is obtained
      - If not refreshing → triggers renewTokens
      - On success → retries the original request with new token
      - On failure → clears headers, updates auth state to false, and forces logout

- **AuthGuard**  

  **Public routes:**  
  - If `isLoadingAuth === true` → Show loading state  
  - If `isAuthenticated === true` → Redirect to `/profile`  
  - If `isAuthenticated === false` → Render normally  

  **Protected routes:**  
  - If `isLoadingAuth === true` → Show loading state  
  - If `isAuthenticated === false` → Redirect to `/login`  
  - If `isAuthenticated === true` → Render normally

- **React Query Hooks**  
  - Encapsulate API logic with loading/error states:
      - useLoginMutation → Calls loginUser, sets token, updates headers, sets ['auth','status'] = true
      - useLogoutMutation → Calls logoutUser, clears headers, cancels queries, sets ['auth','status'] = false
      - useCheckIfUserIsAuthenticatedQuery → Validates user session (used by AuthGuard)
      - renewTokens → Called by Axios interceptor on 401 (silent refresh)

## Flow
      [User Action]
            |
            v
      [Protected Route?] ---- No ----> [Render Component]
            |
           Yes
            v
      [AuthGuard checks auth status via React Query]
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
      [Server validates token]
            |
      401 Unauthorized?
            |
      ---- No ----> [API Request Sent → Response → Update UI]
            |
           Yes
            v
      [AxiosInterceptor handles refreshTokens]
            |
      Refresh success? ---- No ----> [Logout + Redirect to Login]
            |
           Yes
            v
      [Retry original request with new token]
            |
            v
      [API Response]
            |
            v
      [Update UI]

## Advantages

- **Robust token refresh** with request queueing (no race conditions)
- **Silent refresh** for tokens without breaking UX
- **Single source of truth** via React Query (['auth','status'])
- **Automatic state reset** on logout (clears headers + queries)
- **Cross-tab sync** supported via BroadcastChannel for logout events
- **Extensible** for future features (e.g. roles, permissions)
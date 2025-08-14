# Auth Flow

This file describes the authentication layer flow of the application.

## Structure

- **AuthProvider**  
  Provides the `AuthContext` with:
  - `isAuthenticated`
  - `login`
  - `logout`
  - `refreshTokens`
  - `isLoadingAuth`

- **useAuth**  
  Hook that returns the data from `AuthContext`.

- **AuthGuard**  

  **Public routes:**  
  - If `isLoadingAuth === true` → Show loading state  
  - If `isAuthenticated === true` → Redirect to `/profile`  
  - If `isAuthenticated === false` → Render normally  

  **Protected routes:**  
  - If `isLoadingAuth === true` → Show loading state  
  - If `isAuthenticated === false` → Redirect to `/login`  
  - If `isAuthenticated === true` → Render normally

- **Axios Config**  
  Includes interceptors:
  - **Request Interceptor:** Adds the Authorization header
  - **Response Interceptor:**  
    - If token is expired → Calls `refreshTokens` from `AuthContext`  
    - If it fails → Calls `logout`

- **React Query Hooks**  
  Handle API calls (`loginUser`, `logoutUser`, `renewTokens`, `checkIfUserIsAuthenticated`) providing loading & error states.

## Flow
      [User Action]
            |
            v
      [Protected Route?] ---- No ----> [Render Component]
            |
           Yes
            v
      [AuthGuard checks useAuth]
            |
       Authenticated? ---- No ----> [Redirect to Login]
            |
           Yes
            v
       [Render Component]

  -----------------------------------------------------

      [Component makes API call via Axios]
            |
      Authorized? ---- Yes ----> [Redirect to Login]
            |
           No
            v
      [Axios Interceptor checks token validity]
            |
      Expired? ---- No ----> [API Request Sent]
            |
           Yes
            v
      [refreshTokens from AuthContext]
            |
      Success? ---- No ----> [logout from AuthContext]
            |
           Yes
            v
       [API Request Sent]
            |
            v
       [API Response]
            |
            v
      [Update UI]


## Advantages

- **Clean separation of concerns** (Auth, API calls, UI)
- **Silent refresh** for tokens without breaking UX
- **Centralized state management** via Context
- **Full state reset** on logout (React Query + headers)
- **Extensible** for future features (e.g. roles, permissions)
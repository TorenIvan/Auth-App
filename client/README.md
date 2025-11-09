# Auth App - Client

React TypeScript frontend implementing a secure Single Page Application with token-based authentication, OAuth2 social login, and comprehensive user profile management.

## Features

### Authentication & Authorization
- Credential-based login and registration
- OAuth2 social login (Google, GitHub, GitLab, Discord)
- Automatic access token refresh with queue management
- In-memory access token storage (no localStorage)
- Secure refresh token handling via HTTP-only, secure cookies
- Secure logout with token invalidation

### User Experience
- Email verification flow
- Forgot password and reset password flows
- User profile dashboard
- Profile editing (bio, name, phone, etc...)
- Profile image upload and management
- Fully responsive, mobile-first design
- Dark/Light theme with system preference detection
- Fast page transitions with React Router
- Optimistic UI updates with React Query
- Toast notifications for user feedback

### Developer Experience
- Vite for lightning-fast Hot Module Reloading
- TypeScript for type safety
- Zod for runtime type validation
- Route-based architecture
- Route-based code splitting (lazy loading)

## Tech Stack

- **React 18** - UI library with TypeScript
- **Vite** - Next-generation frontend tooling
- **React Router v6** - Declarative routing for SPAs with lazy loading
- **TanStack Query (React Query)** - Server state management and caching
- **Axios** - Promise-based HTTP client with interceptors
- **Zod** - TypeScript-first schema validation
- **react-hot-toast** - Lightweight toast notifications
- **broadcast-channel** - Cross-tab communication for auth sync
- **Font Awesome** - Icon library

## Architecture

### Route-Based Organization
The application is organized into **routes** (similar to backend modules), each representing a domain:
- **auth route**: Login, register, OAuth callbacks, email verification, password reset
- **profile route**: User profile viewing and editing

Each route contains its own miniature folder structure:
- **pages/**: Route components
- **components/**: Route-specific components
- **hooks/**: Route-specific React Query hooks
- **layouts/**: Route layouts
- **api/**: API client functions
- **types/**: TypeScript types

### Shared Structure
Global resources are in the `src/` root:
- **config/**: App configuration (axios, react-query)
- **store/**: Global state (theme context)
- **components/**: Shared components (AuthGuard, AxiosInterceptor, Toast, Loader)
- **hooks/**: Shared custom hooks
- **api/**: Shared API functions
- **utils/**: Constants, helpers, types

### State Management

#### TanStack Query (React Query)
Handles all server state with automatic:
- Caching with configurable stale time (2 minutes default)
- Background refetching disabled for manual control
- Smart retry logic (no retry on 401/403, exponential backoff on network errors)
- Optimistic updates for profile editing
- DevTools in development mode

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 120000, // 2 minutes
      retry: (failureCount, error) => {
        if (error?.response?.status === 401 || error?.response?.status === 403) {
          return false; // Don't retry auth errors
        }
        return failureCount < 3;
      },
    },
  },
});
```

#### React Context
Theme management with localStorage persistence:
- Detects system theme preference on first load
- Toggles between light/dark modes
- Persists choice to localStorage
- Applies theme class to document body

### Authentication System

#### AuthGuard Component
Central authentication guard that:
- Checks authentication status on mount
- Protects private routes (redirects to `/login` if unauthenticated)
- Prevents authenticated users from accessing public routes
- Shows loader during authentication checks and login mutations
- Clears user-specific cache on logout

**Public Routes**: login, register, verify, forgot-password, reset-password, oauth2 callbacks, terms, privacy

**Private Routes**: profile, profile/edit

#### Axios Interceptor
Handles automatic token refresh with queue management:
```typescript
// On 401 response:
1. First request triggers refresh
2. Subsequent 401s queue up while refreshing
3. After refresh succeeds, all queued requests retry with new token
4. If refresh fails, clear auth react query state(automatic redirect to login) and show session expired toast
```

Features:
- Prevents multiple simultaneous refresh calls
- Queues failed requests during refresh
- Retries queued requests with new token
- Handles refresh failures gracefully
- Updates React Query cache with auth status

### Token Management

#### Access Token
- Stored in memory (axios instance default headers)
- Added to all requests via `Authorization: Bearer <token>`
- Short-lived 
- Cleared on page refresh

#### Refresh Token
- Stored in HTTP-only, Secure, SameSite cookie
- Automatically sent with refresh endpoint requests
- Long-lived 
- Rotates on each use (backend invalidates old token)

#### Token Flow
```
1. Login → Access token in memory, refresh token in cookie
2. API request with expired access token → 401 response
3. Interceptor calls refresh endpoint with cookie
4. Backend verifies refresh token, returns new token pair
5. Interceptor updates axios headers with new access token
6. Original request retries automatically
```

## Getting Started

### Prerequisites

- Node.js v18 or higher
- npm

### Installation

```bash
cd client
npm install
```

### Environment Variables

Create `.env` file:

```env
VITE_SERVER_URI=http://localhost:3000
VITE_NODE_ENV=development
```

### Development

Start the development server:
```bash
npm run dev
```

Application runs on http://localhost:5173 with hot module replacement.

### Production Build

```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | TypeScript check + Vite production build |
| `npm run preview` | Preview production build locally |

## Key Features Implementation

### Automatic Token Refresh
The AxiosInterceptor component manages token refresh automatically:
- Intercepts 401 responses
- Queues requests during refresh to prevent race conditions
- Retries failed requests with new token
- Handles refresh failures with user notification

### Protected Routes
AuthGuard component protects routes based on authentication status:
```typescript
// Authenticated users redirected away from public routes
if (isPublic && isAuthenticated) {
  return <Navigate to="/profile" replace />;
}

// Unauthenticated users redirected to login
if (!isPublic && !isAuthenticated) {
  return <Navigate to="/login" replace />;
}
```

### Form Validation
All forms use Zod schemas for validation:
- Client-side validation before submission
- Type-safe with TypeScript inference
- Consistent error messages
- Server-side validation as backup

### OAuth2 Integration
Social login flow:
1. User clicks provider button
2. Client receives authorization code from provider
3. Client sends code to backend
4. Backend exchanges code for user info and returns tokens
5. Client stores tokens and redirects to profile

### Theme System
Persistent theme switching:
- Detects system preference (`prefers-color-scheme`)
- Stores choice in localStorage
- Applies theme class to body element
- Toggle function in context for easy access

### Code Splitting
React Router lazy loading reduces initial bundle size:
```typescript
{
  path: 'profile',
  lazy: () => import('./pages/ProfileDetails'),
}
```

## Security Features

- ✅ Access tokens in memory only (cleared on refresh)
- ✅ HTTP-only, Secure cookies for refresh tokens
- ✅ No sensitive data in localStorage/sessionStorage
- ✅ Automatic token refresh with rotation
- ✅ Input validation with Zod
- ✅ TypeScript for compile-time safety
- ✅ Axios timeout (10 seconds) prevents hanging requests
- ✅ Smart retry logic (no retry on auth errors)

## OAuth2 Provider Disclaimer

**Note**: The application includes route handlers for multiple OAuth2 providers (Google, GitHub, GitLab, Discord, Microsoft, Twitter, LinkedIn). However, only **Google, GitHub, GitLab and Discord** are currently functional. 

Other providers (Microsoft, Twitter, LinkedIn, Facebook) require a registered business entity to obtain OAuth credentials, which is not available for this personal project. The frontend routes and components are implemented and ready to use once proper credentials are obtained.

## Troubleshooting

### Token Refresh Issues
- Check that cookies are being sent (`withCredentials: true`)
- Verify backend CORS configuration allows credentials
- Ensure backend refresh endpoint is working

### OAuth Issues
- Verify redirect URIs match exactly in provider settings
- Check that authorization codes are being captured correctly
- Ensure backend OAuth endpoints are configured properly

### Build Errors
- Run TypeScript check: `npm run build` will fail on type errors
- Check that all environment variables are set
- Ensure all imports are correct

## License

MIT

---

Built with React, TypeScript, and Vite
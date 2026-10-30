# Auth App - Server

Fastify TypeScript backend API implementing secure authentication with JWT-based access/refresh token rotation, OAuth2 integration, email services, and user profile management.

## Features

### Authentication & Security
-  JWT-based authentication (access + refresh tokens)
-  Refresh token rotation with reuse detection (atomic, 10s grace window)
-  HTTP-only, Secure, SameSite=Strict cookies for refresh tokens, `Sec-Fetch-Site` check
-  OAuth2 integration (Google, GitHub, GitLab, Discord)
-  Email verification system with Resend
-  Password reset flow with secure tokens
-  Rate limiting on sensitive endpoints
-  bcryptjs password hashing

### API & Infrastructure
-  Fastify for high-performance HTTP handling
- ️ MongoDB with native driver (no ODM)
-  Connection pooling (up to 120 concurrent operations)
-  Database indexes for optimized queries
-  Zod schema validation on all inputs
-  CORS configured for production/development
-  Multipart form data for file uploads
- ️ Helmet for security headers

### User Management
-  User profile CRUD operations
-  Profile image upload (JPEG/PNG)
-  Email notifications via Resend

## Tech Stack

- **Node.js** with TypeScript
- **Fastify** - Fast and low overhead web framework
- **MongoDB** - NoSQL database with native driver (no ODM)
- **Zod** - TypeScript-first schema validation
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT generation and verification
- **Resend** - Email delivery service
- **Fastify plugins**: helmet, cors, cookie, multipart, static, sensible

## Architecture

### Modular Design
The application is organized into **modules**, each representing a distinct domain:
- **auth module**: Authentication, registration, OAuth, email verification, password reset
- **user module**: User profiles, image uploads, account management

Each module contains:
- **Routes**: Fastify route definitions with hooks and middleware
- **Controller**: HTTP request/response handling
- **Service**: Business logic and database operations
- **Schema**: Zod validation schemas
- **Model**: TypeScript types and interfaces

### Dependency Injection
Services and controllers are wired together using a DI Plugin:
- Services are **singletons** sharing the same DB connection
- Controllers receive dependencies via **constructor injection**
- All wiring happens in the composition root

### Database Layer
- Uses MongoDB native driver directly (no ODM)
- Connection pooling with max 120 concurrent operations
- Indexes created on startup for optimal query performance
- Service layer handles all DB operations
- Controllers only interact with DB for transactions

### Middleware System
Fastify decorators provide reusable authentication guards:
- `verifySameOrigin`: Rejects cross-site requests on the routes that read the refresh cookie
- `verifyAccessTokenHeader`: Validates JWT from Authorization header
- `verifyRefreshTokenCookie`: Validates refresh token from cookies and finds its session
- `verifyResetPasswordCookie`: Validates password reset tokens
- `isAuthenticated`: Checks if user has valid authentication (access token, or the refresh cookie)
- `verifyImageUpload`: Validates uploaded image files (mimetype, magic bytes, size)

## Getting Started

### Prerequisites

- Node.js 24 and npm 11.10 or higher
- MongoDB running locally or connection string
- OAuth2 credentials from providers (Google, GitHub, GitLab, Discord)
- Resend API key for email sending

### Installation

```bash
cd server
npm ci
```

### Development

Start the development server:
```bash
npm run dev
```

Server runs on `http://localhost:3000`; the client reaches it same-origin through the Vite proxy (`https://localhost:5173/api`).

### Production

Build and run:
```bash
npm run build
npm start
```

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm start` | Run production build |
| `npm run test:run` | Run the tests once (in-memory MongoDB, no network) |
| `npm run typecheck` | Type check without emitting |
| `npm run lint` | ESLint (flat config) |

## Environment Variables

Create `.env.development` and `.env.production` files:

```env
# Database
MONGO_URI=mongodb://localhost:27017/authapp
DATABASE_NAME=authapp

# Server
PORT=3000
NODE_ENV=development
SERVER_URI=https://localhost:3000
CLIENT_URI=http://localhost:5173

# JWT Secrets (generate strong random strings)
ACCESS_TOKEN_SECRET=your-access-token-secret-min-32-chars
REFRESH_TOKEN_SECRET=your-refresh-token-secret-min-32-chars
EMAIL_SECRET=your-email-verification-secret
RESET_PASS_COOKIE_SECRET=your-reset-password-secret

# JWT Expiration
ACCESS_TOKEN_EXPIRATION_TIME=3m
REFRESH_TOKEN_EXPIRATION_TIME=30d
EMAIL_TOKEN_EXPIRATION_TIME=1h
RESET_PASS_COOKIE_EXPIRATION_TIME=30m

# Cookie Names
COOKIE_NAME=refreshToken
COOKIE_NAME_SOCIAL_PROFILE=socialProfile # legacy, only to clear the old cookie until 2027-01-31
RESET_PASS_COOKIE_NAME=resetPassword

# Password Hashing
SALT_SIZE=10

# Email Service (Resend)
RESEND_API_KEY=your-resend-api-key
EMAIL_FROM=noreply@yourdomain.com

# OAuth2 - Google
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# OAuth2 - GitHub
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# OAuth2 - GitLab
GITLAB_CLIENT_ID=your-gitlab-client-id
GITLAB_CLIENT_SECRET=your-gitlab-client-secret

# OAuth2 - Discord
DISCORD_CLIENT_ID=your-discord-client-id
DISCORD_CLIENT_SECRET=your-discord-client-secret
```

## Authentication Flow

### Registration & Login (Credentials)

1. **Registration**: Password hashed with bcryptjs, verification email sent via Resend
2. **Email Verification**: User clicks link, JWT verified, user marked as verified
3. **Login**: Access token (3min) in response body, refresh token (30 days) in HTTP-only, secure cookie

### OAuth2 Social Login

1. Client sends authorization code to server
2. Server exchanges code for access token with provider
3. Server fetches user profile from provider
4. Create or login user
5. Return access token (body) and refresh token (cookie)

### Token Refresh

1. Client detects expired access token (401)
2. Calls `POST /v1/auth/refresh` with the refresh token cookie
3. Server verifies the JWT, the user and the session (`sid`)
4. Rotates atomically: the stored hash must be the current token, or the previous one within 10 seconds
5. Any other token of the session is a reuse: the session is revoked
6. Returns the new access token (body) and refresh token (cookie)

### Logout

1. Server marks the session as revoked in DB (`POST /v1/auth/logout-all` revokes every session of the user)
2. Sets `deleteAt` field for auto-deletion
3. Clears all authentication cookies

## Security Features

### Token Security
- ✅ Access tokens in memory on client (3 minutes lifetime)
- ✅ Refresh tokens in HTTP-only, Secure cookies (30 days lifetime)
- ✅ Refresh token rotation with reuse detection; tokens stored as sha256
- ✅ Device tracking (IP + user agent stored with tokens)
- ✅ Auto-deletion of revoked and expired sessions via MongoDB TTL indexes
- ✅ Password reset/change revokes sessions; reset links bound to the reset cookie and single use

### Password & API Security
- ✅ bcryptjs hashing with salt rounds
- ✅ Password requirements enforced via Zod validation
- ✅ Reset tokens in HTTP-only cookies
- ✅ CORS configured for specific origins
- ✅ Helmet security headers
- ✅ Input validation with Zod
- ✅ TypeScript for type safety
- ✅ File upload validation (type, magic bytes, size)
- ✅ Rate limiting on credential and email routes

## Development Notes

### HTTPS in Development
`npm run dev` serves HTTP; HTTPS comes from the Vite dev server (mkcert). Running `dist/app.js` with
`NODE_ENV=development` uses self-signed SSL certificates (`cert.pem`, `key.pem`). These files are git-ignored.

Generate new certificates:
```bash
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes
```

### Service Response Pattern
Services return standardized responses:
```typescript
type ServiceResponse = {
  success: boolean;
  data?: any;
  customError?: string;
};
```

## License

MIT

---

Built with Fastify, TypeScript, and MongoDB
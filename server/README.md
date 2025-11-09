# Auth App - Server

Fastify TypeScript backend API implementing secure authentication with JWT-based access/refresh token rotation, OAuth2 integration, email services, and user profile management.

## Features

### Authentication & Security
-  JWT-based authentication (access + refresh tokens)
-  Refresh token rotation with automatic revocation
-  HTTP-only, Secure, SameSite cookies for refresh tokens
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
- `verifyAccessTokenHeader`: Validates JWT from Authorization header
- `verifyRefreshTokenCookie`: Validates refresh token from cookies
- `verifySocialProfileTokenCookie`: Validates OAuth profile tokens
- `verifyResetPasswordCookie`: Validates password reset tokens
- `isAuthenticated`: Checks if user has valid authentication
- `actionForbiddenToAuthenticatedUser`: Blocks authenticated users from auth routes (not actually needed)
- `verifyImageUpload`: Validates uploaded image files

## Getting Started

### Prerequisites

- Node.js v18 or higher
- MongoDB running locally or connection string
- OAuth2 credentials from providers (Google, GitHub, GitLab, Discord)
- Resend API key for email sending

### Installation

```bash
cd server
npm install
```

### Development

Start the development server with HTTPS:
```bash
npm run dev
```

Server runs on `https://localhost:3000` (HTTPS with self-signed cert)

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
COOKIE_NAME_SOCIAL_PROFILE=socialProfile
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
2. Calls refresh endpoint with refresh token cookie
3. Server verifies token (JWT + DB check)
4. Generates new token pair with **rotation**
5. Old refresh token revoked and auto-deleted via MongoDB TTL index
6. Returns new tokens

### Logout

1. Server marks refresh token as revoked in DB
2. Sets `deleteAt` field for auto-deletion
3. Clears all authentication cookies

## Security Features

### Token Security
- ✅ Access tokens in memory on client (3 minutes lifetime)
- ✅ Refresh tokens in HTTP-only, Secure cookies (30 days lifetime)
- ✅ Refresh token rotation (old tokens revoked immediately)
- ✅ Device tracking (IP + user agent stored with tokens)
- ✅ Auto-deletion of revoked tokens via MongoDB TTL indexes

### Password & API Security
- ✅ bcryptjs hashing with salt rounds
- ✅ Password requirements enforced via Zod validation
- ✅ Reset tokens in HTTP-only cookies
- ✅ CORS configured for specific origins
- ✅ Helmet security headers
- ✅ Input validation with Zod
- ✅ TypeScript for type safety
- ✅ File upload validation (type, size)

## Development Notes

### HTTPS in Development
Development server uses self-signed SSL certificates (`cert.pem`, `key.pem`) for local HTTPS. These files are git-ignored.

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
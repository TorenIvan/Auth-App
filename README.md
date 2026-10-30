# Auth App

A production-ready, full-stack authentication application implementing secure token-based authentication with refresh token rotation, OAuth2 social login, and complete user profile management.

**Live Demo:** https://auth-app.vaggelistzironis.tech/

## Overview

This Single Page Application (SPA) demonstrates modern authentication patterns including:
- Access/Refresh (jwt) token implementation with automatic rotation
- OAuth2 integration with multiple providers
- Secure credential-based authentication
- Complete user profile management
- Email verification and password reset flows

Originally inspired by a DevChallenges.io legacy challenge, this project has evolved into a comprehensive authentication solution.

## Project Structure

```
auth-app/
├── client/          # React TypeScript frontend (SPA)
├── server/          # Fastify TypeScript backend API
└── README.md        # This file
```

## Features

### Authentication
-  **Credential-based auth** - Email/password registration and login
-  **Refresh token rotation** - Every refresh rotates the token; reusing an old one revokes the session
-  **Access tokens** - Short-lived tokens stored in memory
-  **HTTP-only cookies** - Refresh tokens stored securely
-  **OAuth2 providers** - Google, GitHub, GitLab, and Discord integration
-  **Email verification** - Confirm email flow for new registrations
-  **Password reset** - Forgot password and reset password flows

### User Management
-  **Profile management** - Edit bio, name, and other details
-  **Profile images** - Upload and manage profile pictures
-  **User dashboard** - View account details and information
-  **Secure logout** - Revokes the current session, or every session with *Logout all devices*

### Security
-  Refresh token rotation with reuse detection (one session document per login, tokens stored hashed)
-  HTTP-only, Secure, `SameSite=Strict` cookies scoped to `/api/v1/auth`, plus a `Sec-Fetch-Site` check
-  In-memory access token storage (no localStorage/sessionStorage)
-  Automatic token refresh on expiry, serialized across tabs; login/logout synced between tabs
-  Password reset/change revokes sessions; reset links are single use
-  Social logins accept only provider-verified emails
- ️ Zod for runtime validation
-  TypeScript for type safety across the stack

## Tech Stack

### Frontend
- **Vite** as build tool
- **React 19** with TypeScript
- **React Router v8** for routing
- **TanStack Query v5** for server state management
- **Axios** for API communication

### Backend
- **Node.js** with TypeScript
- **Fastify** web framework
- **MongoDB** with no ODM
- **Jsonwebtoken** for creating JWT
- **Zod** for schema validation

### Infrastructure
- **Railway** for hosting and deployment
- **Papaki** Custom domain 
- **Resend** for email sending

## Prerequisites

- Node.js 24 (see `.nvmrc`) and npm 11.10 or higher (for the `.npmrc` supply-chain settings)
- MongoDB (local)
- npm 
- Email service credentials (for email verification/password reset)
- OAuth2 credentials from Google, GitHub, GitLab, and Discord

## Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/TorenIvan/Auth-App.git
cd auth-app
```

### 2. Set up environment variables

#### Server (.env in server directory)
```env
# Database
MONGO_URI=mongodb://localhost:27017/authapp

# JWT Secrets
ACCESS_TOKEN_SECRET=your-access-token-secret
REFRESH_TOKEN_SECRET=your-refresh-token-secret

# Server
PORT=3000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# OAuth2 - Google
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback

# OAuth2 - GitHub
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GITHUB_CALLBACK_URL=http://localhost:3000/api/auth/github/callback

# OAuth2 - GitLab
GITLAB_CLIENT_ID=your-gitlab-client-id
GITLAB_CLIENT_SECRET=your-gitlab-client-secret
GITLAB_CALLBACK_URL=http://localhost:3000/api/auth/gitlab/callback

# OAuth2 - Discord
DISCORD_CLIENT_ID=your-discord-client-id
DISCORD_CLIENT_SECRET=your-discord-client-secret
DISCORD_CALLBACK_URL=http://localhost:3000/api/auth/discord/callback
```

#### Client (.env in client directory)
```env
VITE_CLIENT_URI=https://localhost:5173/
```

### 3. Install dependencies

```bash
# Install server dependencies (exactly the lockfile)
cd server
npm ci

# Install client dependencies
cd ../client
npm ci
```

> **Supply chain:** `server/.npmrc` and `client/.npmrc` only install versions published at least 7 days ago,
> never run install scripts and never fetch git dependencies. Upgrade with `npm install <pkg>@latest`
> (a dist-tag, not an exact version), then check `npm audit signatures` and `npm audit`.

### 4. Start MongoDB

Make sure MongoDB is running on your system or configure MongoDB Atlas connection.

### 5. Run the application

#### Development mode

Start the server:
```bash
cd server
npm run dev
```

Start the client:
```bash
cd client
npm run dev
```

The application will be available at:
- **Frontend:** https://localhost:5173
- **Backend API:** https://localhost:5173/api (Vite proxies `/api` to http://localhost:3000, so development is same-origin like production)

#### Tests

```bash
cd server
npm run test:run
```

Tests run against an in-memory MongoDB and never reach the network (emails, providers and `fetch` are mocked).
The MongoDB binary is fetched once, outside test runs:

```bash
cd server
MONGOMS_VERSION=8.2.6 MONGOMS_DOWNLOAD_DIR=$HOME/.cache/mongodb-binaries MONGOMS_MD5_CHECK=1 \
  node -e "require('mongodb-memory-server').MongoBinary.getPath().then(console.log)"
```

#### Production build

Build the client:
```bash
cd client
npm run build
```

Build the server:
```bash
cd server
npm run build
```

Run production server:
```bash
cd server
npm start
```

## Authentication Flow

### Token Strategy
1. User logs in with credentials or OAuth2: a session (token family) is created
2. Server generates (both carry the session id `sid` and a unique `jti`):
   - **Access token** (short-lived) - sent in response body, kept in memory (stateless)
   - **Refresh token** (long-lived) - sent as HTTP-only cookie, stored hashed in the session (stateful)
3. On a 401 the client calls `POST /api/v1/auth/refresh` once (requests wait in a queue, tabs wait on a Web Lock)
4. The refresh token rotates atomically; the previous one stays valid for a 10s grace window (lost responses)
5. Reusing an older token revokes the whole session (possible theft)
6. Logout revokes the session; *Logout all devices* revokes every session. Access tokens of other devices
   stay valid until they expire: that is the price of stateless access tokens

### OAuth2 Flow
1. User clicks social login button
2. Redirected to OAuth provider
3. After authorization, redirected back to callback URL
4. Server exchanges code for user info and accepts only a provider-verified email
5. Creates the user, or logs into the existing one (an unverified account with that email is claimed
   and loses its password; Facebook never links to other accounts)
6. Issues access and refresh tokens

## Deployment

The application is deployed on Railway (Railpack builder, Node 24, `npm ci`) with custom domain and SSL/TLS certificate.

> **Migration (auth hardening):** sessions created before it are not valid anymore (no `sid`, tokens were not
> hashed), so every user logs in once again. Legacy `path=/` cookies are cleared until 2027-01-31.

## Security Considerations

- Access tokens stored in memory (cleared on page refresh)
- Refresh tokens in HTTP-only, Secure, `SameSite=Strict` cookies (not accessible via JavaScript)
- Refresh token rotation with reuse detection
- Same-origin deployment (CORS only in development), `Sec-Fetch-Site` check on cookie routes
- Password hashing with bcryptjs
- Input validation with Zod on both client and server
- Rate limiting on login, register, forgot and reset password
- Email verification for new accounts
- Uploaded images checked by content (magic bytes), 2 MB limit
- No tokens or query strings in logs, no internal error messages in responses
- TypeScript for type safety
- Known limits (accepted, from the localhost penetration test):
  - An XSS on the page can still call the API (same origin); a stolen access token is valid until it expires
  - `trustProxy` trusts exactly one hop (Railway's proxy). Reached directly or behind another proxy, the
    `X-Forwarded-For` header could bypass the rate limits: adjust `trustProxy` to the real topology
  - Registration and the reset cookie of forgot-password reveal whether an email has a (verified) account
  - Images are checked by their signature, not fully decoded: a PNG with trailing bytes is stored, but it is only
    ever served as `data:image/png` (nosniff, strict CSP), so it cannot run

## Inspiration

This project was originally inspired by a challenge from the legacy DevChallenges.io platform, which provided initial design mockups and requirements. The implementation has been significantly enhanced with modern security patterns and features.

## Project Details

For more detailed information:
- [Client Documentation](./client/README.md) - Frontend implementation details
- [Server Documentation](./server/README.md) - Backend API documentation
- [Auth Flow](./client/AUTHFLOW.md) - How the tokens flow, plus [further reading](./client/AUTHFLOW.md#further-reading) (RFC 10017/BFF, Hasura, Auth0)

## License

MIT

---

Built with TypeScript, Fastify and React
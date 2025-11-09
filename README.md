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
-  **Refresh token rotation** - Secure token refresh mechanism with automatic rotation
-  **Access tokens** - Short-lived tokens stored in memory
-  **HTTP-only cookies** - Refresh tokens stored securely
-  **OAuth2 providers** - Google, GitHub, GitLab, and Discord integration
-  **Email verification** - Confirm email flow for new registrations
-  **Password reset** - Forgot password and reset password flows

### User Management
-  **Profile management** - Edit bio, name, and other details
-  **Profile images** - Upload and manage profile pictures
-  **User dashboard** - View account details and information
-  **Secure logout** - Token invalidation on logout

### Security
-  Refresh token rotation to prevent token reuse
-  HTTP-only and secure cookies for refresh tokens
-  In-memory access token storage (no localStorage/sessionStorage)
-  Automatic token refresh on expiry using Auth Guard
- ️ Zod for runtime validation
-  TypeScript for type safety across the stack

## Tech Stack

### Frontend
- **Vite** as build tool
- **React 18** with TypeScript
- **React Router v6** for routing
- **React Query v4** (TanStack Query) for server state management
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

- Node.js v18 or higher
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
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

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
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3000

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
1. User logs in with credentials or OAuth2
2. Server generates:
   - **Access token** (short-lived, ~5 minutes) - sent in response body
   - **Refresh token** (long-lived, ~30 days) - sent as HTTP-only, secure cookie
3. Client stores access token in memory (JS)
4. On access token expiry, client automatically requests new token using refresh token
5. Refresh token rotates on each use (old token invalidated, new one issued)
6. On logout, refresh token is revoked

### OAuth2 Flow
1. User clicks social login button
2. Redirected to OAuth provider
3. After authorization, redirected back to callback URL
4. Server exchanges code for user info
5. Creates/updates user in database
6. Issues access and refresh tokens
7. Redirects to client with tokens

## Deployment

The application is deployed on Railway with custom domain and SSL/TLS certificate.

## Security Considerations

- Access tokens stored in memory (cleared on page refresh)
- Refresh tokens in HTTP-only, Secure cookies (not accessible via JavaScript)
- Refresh token rotation prevents reuse attacks
- CORS configured for specific origins
- Password hashing with bcryptjs
- Input validation with Zod on both client and server
- Rate limiting on authentication endpoints
- Email verification for new accounts
- TypeScript for type safety

## Inspiration

This project was originally inspired by a challenge from the legacy DevChallenges.io platform, which provided initial design mockups and requirements. The implementation has been significantly enhanced with modern security patterns and features.

## Project Details

For more detailed information:
- [Client Documentation](./client/README.md) - Frontend implementation details
- [Server Documentation](./server/README.md) - Backend API documentation

## License

MIT

---

Built with TypeScript, Fastify and React
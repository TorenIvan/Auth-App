import { Db, MongoClient } from 'mongodb';
import UserService from '../../../modules/user/v1/user.service';
import AuthService from '../../../modules/auth/v1/auth.service';
import UserController from '../../../modules/user/v1/user.controller';
import AuthController from '../../../modules/auth/v1/auth.controller';

declare module 'fastify' {
  export interface FastifyInstance {
    db: Db;
    mongoClient: MongoClient;
    services: {
      auth: AuthService;
      user: UserService;
    };
    controllers: {
      auth: AuthController;
      user: UserController;
    };
    verifySameOrigin: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    verifyAccessTokenHeader: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    verifyRefreshTokenCookie: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    verifyResetPasswordCookie: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    isAuthenticated: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    verifyImageUpload: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }

  export interface FastifyRequest {
    userId: string;
    signInMethod: SignInMethod;
    refreshTokenId: string;
    refreshTokenHash: string;
    sessionId: string;
    cookies: { [cookieName: string]: string | undefined };
  }
}

export {};

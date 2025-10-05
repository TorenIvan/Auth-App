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
    verifyAccessTokenHeader: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    verifySocialProfileTokenCookie: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    verifyRefreshTokenCookie: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    verifyResetPasswordCookie: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    checkIfTokenAlreadyExists: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    isAuthenticated: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    actionForbiddenToAuthenticatedUser: (
      request: FastifyRequest,
      reply: FastifyReply
    ) => Promise<void>;
    verifyImageUpload: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }

  export interface FastifyMultipartFile {
    name: string;
    data: Buffer;
    encoding: string;
    mimetype: string;
    filename: string;
    limit: number;
    fields: object;
    size: number;
  }

  export interface FastifyRequest {
    userId: string;
    signInMethod: SignInMethod;
    refreshTokenId: string;
    cookies: { [cookieName: string]: string | undefined };
    file: FastifyMultipartFile;
  }

  export interface FastifyReply {
    /**
     * Set response cookie
     * @name setCookie
     * @param name Cookie name
     * @param value Cookie value
     * @param options Serialize options
     */
    setCookie(name: string, value: string, options?: fastifyCookie.CookieSerializeOptions): this;

    /**
     * clear response cookie
     * @param name Cookie name
     * @param options Serialize options
     */
    clearCookie(name: string, options?: fastifyCookie.CookieSerializeOptions): this;
  }
}

export {};

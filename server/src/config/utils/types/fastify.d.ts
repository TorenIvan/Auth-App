import { Collection, Db } from "mongodb";
import User from "../../../api/v1/user/user.model";

declare module "fastify" {
  export interface FastifyInstance {
    MongoDB: Db;
    User: Collection<User>;
    verifyAccessTokenHeader: (
      request: FastifyRequest,
      reply: FastifyReply
    ) => Promise<void>;
    verifyRefreshTokenCookie: (
      request: FastifyRequest,
      reply: FastifyReply
    ) => Promise<void>;
    verifyResetPasswordCookie: (
      request: FastifyRequest,
      reply: FastifyReply
    ) => Promise<void>;
    checkIfTokenAlreadyExists: (
      request: FastifyRequest,
      reply: FastifyReply
    ) => Promise<void>;
  }

  export interface FastifyRequest {
    userId: string;
    signInMethod: SignInMethod;
  }
}

export {};

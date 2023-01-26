import { Collection, Db } from "mongodb";
import User from "../../../api/v1/models/User";

declare module "fastify" {
  export interface FastifyInstance {
    MongoDB: Db;
    User: Collection<User>;
  }
}

export {};

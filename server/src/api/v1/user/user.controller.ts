import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { credsUserInput } from "./user.schema";

/**
 * Using singleton design pattern to initiate a class instance only once
 */
class UserController {
  private static instance: InstanceType<typeof UserController>;
  private static fastifyInstance: FastifyInstance;

  constructor(fastifyInstance: FastifyInstance) {
    if (UserController.instance == null) {
      UserController.instance = this;
      UserController.fastifyInstance = fastifyInstance;
    }
    return UserController.instance;
  }

  async registerCredentialsHandler(
    request: FastifyRequest<{ Body: credsUserInput }>,
    reply: FastifyReply
  ) {
    const { email, password } = request.body;

    console.log("this is: ", UserController.fastifyInstance.MongoDB);
    reply.code(201);
    return `Hello ${email}. You have a password of a ${password}`;
  }
}

export default UserController;

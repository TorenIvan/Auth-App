import {
  FastifyInstance,
  FastifyPluginAsync,
} from "fastify";
import { userEditRequestBodySchema } from "./user.schema";
import UserController from "./user.controller";
import { validateRequestBody } from "../../../config/utils/helpers";


/**
 * @description Encapsulates all the routes belonging to user in version 1
 */
const userRoutesV1 = (controller: UserController): FastifyPluginAsync => async (
  fastify: FastifyInstance
): Promise<void> => {
  fastify.register(getUserDetails(controller), { prefix: "/v1/user/details" });
  fastify.register(editUserDetails(controller), { prefix: "/v1/user/edit",});
};

export default userRoutesV1;

const getUserDetails = (controller: UserController): FastifyPluginAsync => {
  return async (fastify: FastifyInstance) => {
    fastify.addHook("preHandler", async (request, reply) => {
      await fastify.verifyAccessTokenHeader(request, reply);
    });
    fastify.get("/", controller.retrieveUserDetails.bind(controller));
  };
};

const editUserDetails = (controller: UserController): FastifyPluginAsync => {
  return async (fastify: FastifyInstance) => {
    fastify.addHook("preHandler", async (request, reply) => {
      await fastify.verifyAccessTokenHeader(request, reply);
      await validateRequestBody(request, reply, userEditRequestBodySchema);
      await fastify.verifyImageUpload(request, reply);
    });
    fastify.post("/", controller.updateUserDetails.bind(controller));
  };
};


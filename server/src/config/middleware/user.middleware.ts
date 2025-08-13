import {
  FastifyInstance,
  FastifyPluginAsync,
  FastifyReply,
  FastifyRequest,
} from "fastify";
import fp from "fastify-plugin";
import { isFileSizeExceeded } from "../utils/helpers";
import createError from "@fastify/error";
import { Errors } from "../utils/constants/Errors";

const userMiddleware: FastifyPluginAsync = fp(
  async (fastify: FastifyInstance): Promise<void> => {
    fastify.decorate(
      "verifyImageUpload",
      async function (request: FastifyRequest, reply: FastifyReply): Promise<void> {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const images = (request.body as any).file as Array<UploadedFile>;
        const image: UploadedFile | null = images ? ((images[0] as UploadedFile) || null) : null;
        if (image !== null) {
            const allowedTypes = ["image/jpeg", "image/png" ];

            if (!allowedTypes.includes(image.mimetype)) {
                return reply.status(400).send(createUserReadableError(Errors.InvalidFileType));
            }
        
            if (!Buffer.isBuffer(image.data) || image.data.length === 0) {
                return reply.status(400).send(createUserReadableError(Errors.InvalidFileData));
            } 
            
            if (isFileSizeExceeded(image) === true) {
                return reply.status(400).send(createUserReadableError(Errors.MaxFileSizeExceeded));
            }
        }
      }
    );
  }
);

export default userMiddleware;

function createUserReadableError(message: string) {
    return createError("400", message);
}
import type { FastifyMultipartAttachFieldsToBodyOptions, MultipartFile } from '@fastify/multipart';
import { MAX_FILE_SIZE_MB } from './isFileSizeExceeded';

/**
 * @description Fields are attached to the body as plain values and the (single) file as an UploadedFile,
 * so the body can be validated like any JSON body.
 * throwFileSizeLimit is off: an oversized file arrives truncated to the limit and isFileSizeExceeded
 * answers with our own message.
 */
export const multipartOptions: FastifyMultipartAttachFieldsToBodyOptions = {
  attachFieldsToBody: 'keyValues',
  throwFileSizeLimit: false,
  limits: {
    fileSize: MAX_FILE_SIZE_MB * 1024 * 1024,
    files: 1,
  },
  async onFile(part: MultipartFile) {
    const file: UploadedFile = {
      data: await part.toBuffer(),
      filename: part.filename,
      encoding: part.encoding,
      mimetype: part.mimetype,
    };
    part.value = file;
  },
};

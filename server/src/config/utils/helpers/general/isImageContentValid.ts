const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const JPEG_SIGNATURE = Buffer.from([0xff, 0xd8, 0xff]);

/**
 * @description The mimetype is chosen by the client, so the file content (magic bytes) must match it.
 */
export function isImageContentValid(data: Buffer, mimetype: string): boolean {
  if (mimetype === 'image/png') {
    return data.subarray(0, PNG_SIGNATURE.length).equals(PNG_SIGNATURE);
  }
  if (mimetype === 'image/jpeg') {
    return data.subarray(0, JPEG_SIGNATURE.length).equals(JPEG_SIGNATURE);
  }
  return false;
}

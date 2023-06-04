const MAX_FILE_SIZE_MB = 16;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export function isFileSizeExceeded(file: UploadedFile): boolean {
  const fileSizeInBytes = file.data.length;
  return fileSizeInBytes > MAX_FILE_SIZE_BYTES;
}

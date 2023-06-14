const MAX_FILE_SIZE_MB = 16;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export function isFileSizeExceeded(file: UploadedFile | null): boolean {
  if (file === null) {
    return false;
  }
  const fileSizeInBytes = file.data.length;
  if (fileSizeInBytes < MAX_FILE_SIZE_BYTES) {
    return false;
  }
  return true;
}

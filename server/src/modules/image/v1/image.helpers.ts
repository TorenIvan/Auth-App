//export function createImageURL(image: UploadedFile): string {
//  //  const blob = base64ToBlob(image.data, image.mimetype);
//  return URL.createObjectURL(blob);
//}
//
//function base64ToBlob(base64: string): Buffer {
//  const base64Data = base64.replace(/^BinData\(\d+, '(.+)'\)$/, "$1");
//  const binaryString = Buffer.from(base64Data, "base64").toString("binary");
//  return Buffer.from(binaryString, "binary");
//}

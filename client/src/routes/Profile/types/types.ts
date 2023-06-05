export type TUserInfo =
  | {
      image?: Buffer;
      username: string;
      email: string;
      phone: string;
      biography: string;
      signInMethod: string;
    }
  | undefined;

export type UploadedFile = {
  data: Buffer;
  filename: string;
  encoding: string;
  mimetype: string;
  limit: boolean;
};

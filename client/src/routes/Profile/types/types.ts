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

export type TUserInfo =
  | {
      image?: string;
      username: string;
      email: string;
      phone: string;
      biography: string;
      signInMethod: string;
    }
  | undefined;

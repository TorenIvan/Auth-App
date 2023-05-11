export type TUserInfo =
  | {
      username: string;
      email: string;
      phone: string;
      biography: string;
      signInMethod: string;
    }
  | undefined;


import { useCallback, useState } from "react";

export function useHidePassword(): TUseHidePassword {
  const [hidePassword, setHidePassword] = useState<boolean>(true);

  const togglePasswordVisibility = useCallback(function (): void {
    setHidePassword((prevHidePassword) => !prevHidePassword);
  }, []);

  return [hidePassword, togglePasswordVisibility] as const;
}

type TUseHidePassword = readonly [
  hidePassword: boolean,
  togglePasswordVisibility: () => void
];

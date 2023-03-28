import React from "react";
import { Theme } from "../../utils/Types";

function useThemeAtom({ theme }: { theme: Theme }) {
  const [isThemeDark, setIsThemeDark] = useAtom<Atom<boolean>>(isThemeDarkAtom);
  if (condition) {
  }
}

export default useThemeAtom;

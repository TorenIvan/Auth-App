import { useAtom } from "jotai";
import Constants from "../../utils/Constants";
import { Theme } from "../../utils/Types";
import { themeAtom } from "../../store";

type returnType = [theme: Theme, toggleTheme: () => void];

export function useTheme(): returnType {
  const [theme, setTheme] = useAtom(themeAtom);

  const toggleTheme = () => {
    const newTheme =
      theme === Constants.LightPalette
        ? Constants.DarkPalette
        : Constants.LightPalette;

    setTheme(newTheme);
  };

  document.body.className = theme;
  return [theme, toggleTheme];
}

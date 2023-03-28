import { useLocalStorage } from "./useLocalStorage";
import Constants from "../../utils/Constants";
import { Theme } from "../../utils/Types";
import { useAtom } from "jotai";
import { themeAtom } from "../../store";

type returnType = [theme: Theme, toggleTheme: () => void];

export function useTheme(themeArg: Theme): returnType {
  const [theme, setTheme] = useLocalStorage<Theme>(Constants.Theme, themeArg);
  const [, setThemeAtomValue] = useAtom(themeAtom);

  const toggleTheme = () => {
    const newTheme =
      theme === Constants.LightPalette
        ? Constants.DarkPalette
        : Constants.LightPalette;

    setTheme(newTheme);
    setThemeAtomValue(newTheme);
  };

  document.body.className = theme;
  return [theme, toggleTheme];
}

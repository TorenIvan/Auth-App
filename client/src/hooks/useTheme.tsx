import Constants from "../utils/Constants";
import { Theme } from "../utils/Types";
import { useLocalStorage } from "./useLocalStorage";

type returnType = [theme: Theme, toggleTheme: () => void];

export function useTheme(themeArg: Theme): returnType {
  const [theme, setTheme] = useLocalStorage<Theme>("theme", themeArg);

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

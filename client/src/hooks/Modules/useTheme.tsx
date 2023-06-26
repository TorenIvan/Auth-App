import { useAtom } from "jotai";
import { GlobalConstants, Theme } from "../../utils";
import { themeAtom } from "../../store";

type ReturnType = [theme: Theme, toggleTheme: () => void];

export function useTheme(): ReturnType {
  const [theme, setTheme] = useAtom(themeAtom);

  const toggleTheme = () => {
    const newTheme =
      theme === GlobalConstants.LightPalette
        ? GlobalConstants.DarkPalette
        : GlobalConstants.LightPalette;

    setTheme(newTheme);
  };

  document.body.className = theme;
  return [theme, toggleTheme];
}

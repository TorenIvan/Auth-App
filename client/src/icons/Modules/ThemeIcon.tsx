import { memo } from "react";
import { MoonIcon } from "./ThemeSpecific/MoonIcon";
import { SunIcon } from "./ThemeSpecific/SunIcon";
import Constants from "../../utils/Constants";
import { Theme } from "../../utils/Types";

const ThemeIcon = memo(({ theme }: { theme: Theme }): JSX.Element => {
  if (theme === Constants.LightPalette) return <MoonIcon />;
  return <SunIcon />;
});

export { ThemeIcon };

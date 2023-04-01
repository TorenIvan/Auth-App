import { memo } from "react";
import { MoonIcon } from "./ThemeSpecific/MoonIcon";
import { SunIcon } from "./ThemeSpecific/SunIcon";
import { GlobalConstants } from "../../utils";
import { Theme } from "../../utils/Types";

const ThemeIcon = memo(({ theme }: { theme: Theme }): JSX.Element => {
  if (theme === GlobalConstants.LightPalette) return <MoonIcon />;
  return <SunIcon />;
});

export { ThemeIcon };

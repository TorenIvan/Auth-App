import { memo } from "react";
import { MoonIcon, SunIcon } from "../../assets";
import Constants from "../../utils/Constants";
import { Theme } from "../../utils/Types";

const ThemeIcon = ({ theme }: { theme: Theme }): JSX.Element => {
  if (theme === Constants.LightPalette) return <MoonIcon />;
  return <SunIcon />;
};

export default memo(ThemeIcon);

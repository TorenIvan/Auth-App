import { DevChallengesDark, DevChallengesLight } from "../../../icons";
import Constants from "../../../utils/Constants";
import { Theme } from "../../../utils/Types";

const ThemeIcon = ({ theme }: { theme: Theme }): JSX.Element => {
  if (theme === Constants.LightPalette) return <DevChallengesDark />;
  return <DevChallengesLight />;
};

export { ThemeIcon };

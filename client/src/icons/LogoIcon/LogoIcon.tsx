import { GlobalConstants } from "../../utils";
import { useTheme } from "../../store";
import { DevChallengesDark, DevChallengesLight } from "../ThemeSpecific";
import styles from "./styles.module.scss";

const LogoIcon = (): JSX.Element => {
  const [theme] = useTheme();

  let themeIcon: JSX.Element = <DevChallengesLight />;
  if (theme === GlobalConstants.LightPalette) {
    themeIcon = <DevChallengesDark />;
  }

  return <div className={styles["icon-container"]}>{themeIcon}</div>;
};

export default LogoIcon;

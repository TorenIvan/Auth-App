import Constants from "../../../../utils/Constants";
import { Theme } from "../../../../utils/Types";
import { DevChallengesDark, DevChallengesLight } from "../../../../icons";
import styles from "./styles.module.scss";

interface IProps {
  theme: Theme;
}

const ThemeIcon = ({ theme }: IProps): JSX.Element => {
  let themeIcon: JSX.Element = <DevChallengesLight />;
  if (theme === Constants.LightPalette) {
    themeIcon = <DevChallengesDark />;
  }

  return <div className={styles["icon-container"]}>{themeIcon}</div>;
};

export default ThemeIcon;

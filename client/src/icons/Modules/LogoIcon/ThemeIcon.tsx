import { useAtom } from "jotai";
import { themeAtom } from "../../../store";
import Constants from "../../../utils/Constants";
import { DevChallengesDark, DevChallengesLight } from "../..";
import styles from "./styles.module.scss";

const ThemeIcon = (): JSX.Element => {
  const [theme, _] = useAtom(themeAtom);

  let themeIcon: JSX.Element = <DevChallengesLight />;
  if (theme === Constants.LightPalette) {
    themeIcon = <DevChallengesDark />;
  }

  return <div className={styles["icon-container"]}>{themeIcon}</div>;
};

export default ThemeIcon;

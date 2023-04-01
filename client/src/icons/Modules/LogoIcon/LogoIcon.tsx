import { useAtom } from "jotai";
import { themeAtom } from "../../../store";
import { GlobalConstants } from "../../../utils";
import { DevChallengesDark, DevChallengesLight } from "../..";
import styles from "./styles.module.scss";

const LogoIcon = (): JSX.Element => {
  const [theme, _] = useAtom(themeAtom);

  let themeIcon: JSX.Element = <DevChallengesLight />;
  if (theme === GlobalConstants.LightPalette) {
    themeIcon = <DevChallengesDark />;
  }

  return <div className={styles["icon-container"]}>{themeIcon}</div>;
};

export default LogoIcon;

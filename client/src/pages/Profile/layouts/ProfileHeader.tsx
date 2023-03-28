import { useAtom } from "jotai";
import Constants from "../../../utils/Constants";
import { themeAtom } from "../../../store";
import { ThemeIcon } from "../helpers";
import styles from "./styles.module.scss";

function ProfileHeader() {
  const [themeAtomValue, _] = useAtom(themeAtom);

  return (
    <div className={styles["developer-information"]}>
      <ThemeIcon theme={themeAtomValue} />
      <span>{Constants.ChallengeSite}</span>
    </div>
  );
}

export default ProfileHeader;

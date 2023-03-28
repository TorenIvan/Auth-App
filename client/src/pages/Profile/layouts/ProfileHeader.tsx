import { useAtom } from "jotai";
import { themeAtom } from "../../../store";
import { ThemeIcon } from "../helpers";
import styles from "./styles.module.scss";
import { UserAvatar } from "../components";

function ProfileHeader() {
  const [themeAtomValue, _] = useAtom(themeAtom);

  return (
    <div className={styles["developer-information"]}>
      <ThemeIcon theme={themeAtomValue} />
      <div className={styles["avatar-select-container"]}>
        <UserAvatar theme={themeAtomValue} />
        <span>{"UserName ali8eias"}</span>
      </div>
    </div>
  );
}

export default ProfileHeader;

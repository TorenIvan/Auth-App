import { useAtom } from "jotai";
import { themeAtom } from "../../../store";
import { ThemeIcon, UserAvatar, UserOptionList } from "../components";
import styles from "./styles.module.scss";

function ProfileHeader() {
  const [theme, _] = useAtom(themeAtom);

  return (
    <div className={styles["developer-information"]}>
      <ThemeIcon theme={theme} />
      <div className={styles["avatar-select-container"]}>
        <UserAvatar theme={theme} />
        <UserOptionList />
      </div>
    </div>
  );
}

export default ProfileHeader;

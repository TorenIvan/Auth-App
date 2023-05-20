import { useAtom } from "jotai";
import { themeAtom } from "../../../../store";
import Assets from "../../../../assets";
import { Theme, GlobalConstants } from "../../../../utils";
import styles from "./styles.module.scss";

function UserAvatar({ userAvatar }: IProps): JSX.Element {
  const [theme, _] = useAtom<Theme>(themeAtom);

  if (userAvatar === undefined) {
    return (
      <img
        src={Assets.GenericAvatar}
        alt="Avatar"
        className={`${styles.genericAvatar} ${
          theme === GlobalConstants.DarkPalette ? styles.invertWhite : ""
        }`}
      />
    );
  }
  return <img src={userAvatar} alt="ProfileImage" className={styles.avatar} />;
}

export default UserAvatar;

interface IProps {
  userAvatar?: string;
}

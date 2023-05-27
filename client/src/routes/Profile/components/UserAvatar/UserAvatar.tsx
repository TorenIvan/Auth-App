import { useAtom } from "jotai";
import { themeAtom } from "../../../../store";
import { Theme, GlobalConstants } from "../../../../utils";
import Assets from "../../../../assets";
import styles from "./styles.module.scss";

function UserAvatar({ userImage }: IProps): JSX.Element {
  const [theme, _] = useAtom<Theme>(themeAtom);

  if (userImage === undefined) {
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
  return (
    <img src={userImage} alt="ProfileImage" className={styles.genericAvatar} />
  );
}

export default UserAvatar;

interface IProps {
  userImage?: string;
}

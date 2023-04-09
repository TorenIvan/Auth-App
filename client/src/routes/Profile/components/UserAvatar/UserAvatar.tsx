import Assets from "../../../../assets";
import { Theme, GlobalConstants } from "../../../../utils";
import styles from "./styles.module.scss";

function UserAvatar({ theme, userAvatar }: IProps): JSX.Element {
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
  return <></>;
}

export default UserAvatar;

interface IProps {
  theme: Theme;
  userAvatar?: string;
}

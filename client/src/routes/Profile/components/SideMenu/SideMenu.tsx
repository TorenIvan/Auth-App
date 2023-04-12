import { ReactNode } from "react";
import { useAtom } from "jotai";
import { themeAtom } from "../../../../store";
import SubMenu from "../SubMenu";
import UserAvatar from "../UserAvatar";
import styles from "./styles.module.scss";

interface IProps {
  isOpen: boolean;
  onPressingOpenButton: (isOpen?: boolean) => void;
  children: ReactNode;
}

function SideMenu({ isOpen, onPressingOpenButton, children }: IProps) {
  const [theme, _] = useAtom(themeAtom);

  return (
    <div
      className={styles["account-menu"]}
      onMouseOver={() => onPressingOpenButton(true)}
      onMouseOut={() => onPressingOpenButton(false)}
      onClick={() => onPressingOpenButton()}
    >
      <div className={styles["account-menu-dropdown"]}>
        <span>
          <UserAvatar theme={theme} />
        </span>
        <span>Vaggelisshmos</span>
        <span
          className={`${styles.caret} ${isOpen === true ? styles.open : ""}`}
          role="presentation"
        />
      </div>
      {children}
    </div>
  );
}

SideMenu.SubMenu = SubMenu;

export default SideMenu;

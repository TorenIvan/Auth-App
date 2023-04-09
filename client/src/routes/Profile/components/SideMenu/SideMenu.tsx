import { ReactNode } from "react";
import { useAtom } from "jotai";
import { themeAtom } from "../../../../store";
import SideMenuItem from "../SideMenuItem";
import UserAvatar from "../UserAvatar";
import styles from "./styles.module.scss";

interface IProps {
  isOpen: boolean;
  onPressingOpenButton: () => void;
  children: ReactNode;
}

function SideMenu({ isOpen, onPressingOpenButton, children }: IProps) {
  const [theme, _] = useAtom(themeAtom);

  if (isOpen === true) {
    return (
      <div className={styles["account-menu"]} onClick={onPressingOpenButton}>
        <div className={styles["account-menu-dropdown"]}>
          <span>
            <UserAvatar theme={theme} />
          </span>
          <span>Vaggelisshmos</span>
          <span>arrow</span>
        </div>
        <div className={styles["account-menu-info-sub-menu"]}></div>
      </div>
    );
  }

  return (
    <div
      className={styles["side-menu-container"]}
      onClick={onPressingOpenButton}
    >
      {/*<UserAvatar theme={theme} /> */}
    </div>
  );
}

export default SideMenu;

SideMenu.Item = SideMenuItem;

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

  return (
    <div className={styles["account-menu"]}>
      <div
        className={styles["account-menu-dropdown"]}
        onClick={onPressingOpenButton}
      >
        <span>
          <UserAvatar theme={theme} />
        </span>
        <span>Vaggelisshmos</span>
        <span
          className={`${styles.caret} ${isOpen === true ? styles.open : ""}`}
          role="presentation"
        />
      </div>
      <div
        className={`${styles["account-menu-info-sub-menu"]} ${
          isOpen === true ? styles.open : ""
        }`}
      >
        {children}
      </div>
    </div>
  );
}

export default SideMenu;

SideMenu.Item = SideMenuItem;

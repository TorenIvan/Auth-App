import { useAtom } from "jotai";
import { ReactNode } from "react";
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
      <div
        className={styles["side-menu-container"]}
        onClick={onPressingOpenButton}
      >
        <UserAvatar theme={theme} />
        <div
          style={{
            fontSize: "25px",
            display: "inline-block",
            cursor: "pointer",
            // color: var(--text-secondary)
          }}
        >
          <span>UserName </span>
          &darr;
        </div>
      </div>
    );
  }

  return (
    <div className={styles["side-menu-container"]}>
      <UserAvatar theme={theme} />
    </div>
  );
}

export default SideMenu;

SideMenu.Item = SideMenuItem;

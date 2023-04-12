import { ReactNode } from "react";
import { useAtom } from "jotai";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleUser,
  faUserGroup,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { themeAtom } from "../../../../store";
import SideMenuItem from "../SideMenuItem";
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
      <div
        className={`${styles["account-menu-info-sub-menu"]} ${
          isOpen === true ? styles.open : ""
        }`}
      >
        <ul className={styles["account-menu-list-container"]}>
          <li>
            <FontAwesomeIcon
              icon={faCircleUser}
              className={styles["account-menu-icon"]}
              size="xl"
            />
            <span>My Profile</span>
          </li>
          <li>
            <FontAwesomeIcon
              icon={faUserGroup}
              className={styles["account-menu-icon"]}
              size="lg"
            />
            <span>Group Chat</span>
          </li>
          <hr className={styles.divider}></hr>
          <li>
            <FontAwesomeIcon
              icon={faRightFromBracket}
              className={styles["account-menu-icon"]}
              size="lg"
            />
            <span>Logout</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default SideMenu;

SideMenu.Item = SideMenuItem;

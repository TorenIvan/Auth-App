import { useQuery } from "@tanstack/react-query";
import { ReactNode } from "react";
import { userDetailsQuery } from "../../api";
import SubMenu from "../SubMenu";
import UserAvatar from "../UserAvatar";
import styles from "./styles.module.scss";

interface IProps {
  isOpen: boolean;
  onPressingOpenButton: (isOpen?: boolean) => void;
  children: ReactNode;
}

function SideMenu({ isOpen, onPressingOpenButton, children }: IProps) {
  const { data: userInfo } = useQuery(userDetailsQuery)

  const iconSlot: JSX.Element = <UserAvatar userImage={userInfo?.image} />;

  return (
    <div
      className={styles["account-menu"]}
      onMouseOver={() => onPressingOpenButton(true)}
      onMouseOut={() => onPressingOpenButton(false)}
      onClick={() => onPressingOpenButton()}
    >
      <div className={styles["account-menu-dropdown"]}>
        {iconSlot}
        <span>{userInfo?.username}</span>
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

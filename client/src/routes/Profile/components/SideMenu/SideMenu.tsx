import { useQueryClient } from "@tanstack/react-query";
import { ReactNode } from "react";
import { userDetailsQuery } from "../../api";
import { TUserInfo } from "../../types";
import SubMenu from "../SubMenu";
import UserAvatar from "../UserAvatar";
import styles from "./styles.module.scss";

interface IProps {
  isOpen: boolean;
  onPressingOpenButton: (isOpen?: boolean) => void;
  children: ReactNode;
}

function SideMenu({ isOpen, onPressingOpenButton, children }: IProps) {
  const queryClient = useQueryClient();
  const { queryKey } = userDetailsQuery();
  const userInfo: TUserInfo = queryClient.getQueryData(queryKey);

  return (
    <div
      className={styles["account-menu"]}
      onMouseOver={() => onPressingOpenButton(true)}
      onMouseOut={() => onPressingOpenButton(false)}
      onClick={() => onPressingOpenButton()}
    >
      <div className={styles["account-menu-dropdown"]}>
        <span>
          <UserAvatar />
        </span>
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

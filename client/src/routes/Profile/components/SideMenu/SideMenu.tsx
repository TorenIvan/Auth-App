import { useQueryClient } from "@tanstack/react-query";
import { ReactNode } from "react";
import { userDetailsQuery } from "../../api";
import { TUserInfo } from "../../types";
import SubMenu from "../SubMenu";
import UserAvatar from "../UserAvatar";
import UserPhoto from "../UserPhoto";
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

  // const iconSlot: JSX.Element = (
  //   <UserAvatar
  //     userImage={
  //       "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80"
  //     }
  //   />
  // );

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

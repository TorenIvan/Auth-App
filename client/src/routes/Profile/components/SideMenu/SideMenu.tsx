import { ReactNode } from "react";
import SubMenu from "../SubMenu";
import UserAvatar from "../UserAvatar";
import { useRetrieveUserDataQuery } from "../../hooks";
import styles from "./styles.module.scss";

interface IProps {
  isOpen: boolean;
  onPressingOpenButton: (isOpen?: boolean) => void;
  children: ReactNode;
}

function SideMenu({ isOpen, onPressingOpenButton, children }: IProps) {
  const { userInfo, isFetching } = useRetrieveUserDataQuery();

  return (
    <div
      className={styles["account-menu"]}
      onMouseOver={() => onPressingOpenButton(true)}
      onMouseOut={() => onPressingOpenButton(false)}
      onClick={() => onPressingOpenButton()}
    >
      <div className={styles["account-menu-dropdown"]}>
        <UserAvatar userImage={userInfo?.image} isLoading={isFetching} />
        <span className={isFetching ? 'text-skeleton narrow' : undefined}>{userInfo?.username}</span>
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

import { ReactNode } from "react";
import Divider from "../Divider";
import SubMenuItem from "../SubMenuItem";
import styles from "./styles.module.scss";

function SubMenu({ isOpen, children }: IProps): JSX.Element {
  return (
    <div
      className={`${styles["account-menu-info-sub-menu"]} ${
        isOpen === true ? styles.open : ""
      }`}
    >
      <ul className={styles["account-menu-list-container"]}>{children}</ul>
    </div>
  );
}

SubMenu.Item = SubMenuItem;
SubMenu.Divider = Divider;

export default SubMenu;

interface IProps {
  isOpen: boolean;
  children: ReactNode;
}

import { ReactNode } from "react";
import SubMenuItemContent from "../SubMenuItemContent";
import styles from "./styles.module.scss";

function SubMenuItem({ isUsed, children, onClick }: IProps): JSX.Element {
  return (
    <li className={`${isUsed === true ? styles.used : ""}`}>{children}</li>
  );
}

SubMenuItem.Content = SubMenuItemContent;

export default SubMenuItem;

interface IProps {
  isUsed: boolean;
  children: ReactNode;
  onClick: () => void;
}

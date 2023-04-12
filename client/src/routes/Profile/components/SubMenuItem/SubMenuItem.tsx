import { ReactNode } from "react";
import SubMenuItemImage from "../SubMenuItemImage";
import SubMenuItemText from "../SubMenuItemText";
import styles from "./styles.module.scss";

function SubMenuItem({ isUsed, children, onClick }: IProps): JSX.Element {
  return (
    <li className={`${isUsed === true ? styles.used : ""}`}>{children}</li>
  );
}

SubMenuItem.Image = SubMenuItemImage;
SubMenuItem.Text = SubMenuItemText;

export default SubMenuItem;

interface IProps {
  isUsed: boolean;
  children: ReactNode;
  onClick: () => void;
}

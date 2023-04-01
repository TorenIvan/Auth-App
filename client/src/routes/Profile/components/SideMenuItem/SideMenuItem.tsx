import { ReactNode } from "react";
import SideMenuItemContent from "../SideMenuItemContent";

interface IProps {
  isUsed: boolean;
  children: ReactNode;
  onClick: () => void;
}

function SideMenuItem({ isUsed, children, onClick }: IProps): JSX.Element {
  return <div>SideMenuItem</div>;
}

export default SideMenuItem;

SideMenuItem.Content = SideMenuItemContent;

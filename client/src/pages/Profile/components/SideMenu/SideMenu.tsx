import { Fragment, ReactNode } from "react";
import SideMenuItem from "../SideMenuItem";

interface IProps {
  isOpen: boolean;
  onPressingOpenButton: () => void;
  children: ReactNode;
}

function SideMenu({ isOpen, onPressingOpenButton, children }: IProps) {
  if (isOpen === true) {
    return (
      <Fragment>
        <label htmlFor="userAction">Username ali8eias</label>
        <select name="userInfo">{children}</select>
      </Fragment>
    );
  }
  return <Fragment></Fragment>;
}

export default SideMenu;

SideMenu.Item = SideMenuItem;

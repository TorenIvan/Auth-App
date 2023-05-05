import { Fragment } from "react";
import { Outlet } from "react-router-dom";
import {
  faCircleUser,
  faRightFromBracket,
  faUserGroup,
} from "@fortawesome/free-solid-svg-icons";
import { Footer, Header, Main } from "../../../layouts";
import { SideMenu } from "../components";
import { Constants } from "../constants";
import { useToggleSubMenu } from "../hooks";
import { logout } from "../api";
import { useQueryClient } from "@tanstack/react-query";

function ProfileLayout() {
  const [isSubMenuOpen, toggleSubMenu] = useToggleSubMenu();
  const queryClient = useQueryClient();

  return (
    <Fragment>
      <Header
        rightSlot={
          <SideMenu isOpen={isSubMenuOpen} onPressingOpenButton={toggleSubMenu}>
            <SideMenu.SubMenu isOpen={isSubMenuOpen}>
              <SideMenu.SubMenu.Item isUsed onClick={() => {}}>
                <SideMenu.SubMenu.Item.Image icon={faCircleUser} size="xl" />
                <SideMenu.SubMenu.Item.Text value={Constants.MyProfile} />
              </SideMenu.SubMenu.Item>
              <SideMenu.SubMenu.Item isUsed={false} onClick={() => {}}>
                <SideMenu.SubMenu.Item.Image icon={faUserGroup} size="lg" />
                <SideMenu.SubMenu.Item.Text value={Constants.GroupChat} />
              </SideMenu.SubMenu.Item>
              <SideMenu.SubMenu.Divider />
              <SideMenu.SubMenu.Item
                isUsed={false}
                onClick={() => {
                  logout(queryClient);
                }}
              >
                <SideMenu.SubMenu.Item.Image
                  icon={faRightFromBracket}
                  size="lg"
                  color="#EB5757"
                />
                <SideMenu.SubMenu.Item.Text
                  value={Constants.Logout}
                  color="#EB5757"
                />
              </SideMenu.SubMenu.Item>
            </SideMenu.SubMenu>
          </SideMenu>
        }
      />
      <Main>
        <Outlet />
      </Main>
      <Footer />
    </Fragment>
  );
}

export default ProfileLayout;

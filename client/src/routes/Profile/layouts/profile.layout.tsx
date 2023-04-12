import {
  faCircleUser,
  faRightFromBracket,
  faUserGroup,
} from "@fortawesome/free-solid-svg-icons";
import { Fragment } from "react";
import { Outlet } from "react-router-dom";
import { Footer, Header, Main } from "../../../layouts";
import { SideMenu } from "../components";
import { Constants } from "../constants";
import { useToggleSubMenu } from "../hooks";

function ProfileLayout() {
  const [isSubMenuOpen, toggleSubMenu] = useToggleSubMenu();

  return (
    <Fragment>
      <Header
        rightSlot={
          <SideMenu isOpen={isSubMenuOpen} onPressingOpenButton={toggleSubMenu}>
            <SideMenu.SubMenu isOpen={isSubMenuOpen}>
              <Fragment>
                <SideMenu.SubMenu.Item isUsed onClick={() => {}}>
                  <SideMenu.SubMenu.Item.Content
                    icon={faCircleUser}
                    value={Constants.MyProfile}
                  />
                </SideMenu.SubMenu.Item>
                <SideMenu.SubMenu.Item isUsed={false} onClick={() => {}}>
                  <SideMenu.SubMenu.Item.Content
                    icon={faUserGroup}
                    value={Constants.GroupChat}
                  />
                </SideMenu.SubMenu.Item>
                <SideMenu.SubMenu.Divider />
                <SideMenu.SubMenu.Item isUsed={false} onClick={() => {}}>
                  <SideMenu.SubMenu.Item.Content
                    icon={faRightFromBracket}
                    value={Constants.Logout}
                    color="red"
                  />
                </SideMenu.SubMenu.Item>
              </Fragment>
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

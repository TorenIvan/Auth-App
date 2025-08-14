import { Fragment, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useToggleSubMenu } from "../hooks";
import { SideMenu } from "../components";
import { Header, Main, Footer } from "../../../layouts";
import {
  faCircleUser,
  faRightFromBracket,
  faUserGroup,
} from "@fortawesome/free-solid-svg-icons";
import { Constants } from "../constants";
import { BroadcastChannel } from "broadcast-channel";
import { useAuth } from "../../../store";
import { Errors } from "../errors";

export function ProfileLayout() {
  const { logout: logoutContext } = useAuth();
  const [isSubMenuOpen, toggleSubMenu] = useToggleSubMenu();
  const navigate = useNavigate();
  const logoutChannel = new BroadcastChannel("logout");

  function logout() {
    logoutChannel.postMessage("logout");
  }

  useEffect(() => {
    logoutChannel.onmessage = async () => {
      try {
        await logoutContext();
        logoutChannel.close();
        navigate("/login");
      } catch (error) {
        console.error(error);
        toast.error(Errors.GenericError);
      }
    };

    return () => {
      logoutChannel.close();
    };
  }, []);

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
              <SideMenu.SubMenu.Item isUsed={false} onClick={logout}>
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
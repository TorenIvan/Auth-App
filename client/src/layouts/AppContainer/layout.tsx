import { Fragment, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  faCircleUser,
  faRightFromBracket,
  faUserGroup,
} from "@fortawesome/free-solid-svg-icons";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { BroadcastChannel } from 'broadcast-channel';
import { Errors } from "../../utils";
import Header from "../Header";
import Main from "../Main";
import Footer from "../Footer";
import { useToggleSubMenu } from "../../routes/Profile/hooks";
import { logoutUser, userDetailsQuery } from "../../routes/Profile/api";
import { SideMenu } from "../../routes/Profile/components";
import { Constants } from "../../routes/Profile/constants";

function ProfileLayout() {
  const [isSubMenuOpen, toggleSubMenu] = useToggleSubMenu();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const logoutChannel = new BroadcastChannel('logout');

  function logout() {
    logoutChannel.postMessage('logout');
  }

  const logoutAllTabs = () => {
    console.log('logoutAllTabs');
    logoutChannel.onmessage = async () => {
      try {
        await logoutUser(queryClient);
        logoutChannel.close();
        return navigate("login");
      } catch (error) {
        console.error(error);
        toast.error(Errors.GenericError);
        return undefined;
      }
    }
  }

  useEffect(() => {
    logoutAllTabs()
  }, [])

  return (
    <Fragment>
      <Header
        rightSlot={
          <SideMenu isOpen={isSubMenuOpen} onPressingOpenButton={toggleSubMenu}>
            <SideMenu.SubMenu isOpen={isSubMenuOpen}>
              <SideMenu.SubMenu.Item isUsed onClick={() => { }}>
                <SideMenu.SubMenu.Item.Image icon={faCircleUser} size="xl" />
                <SideMenu.SubMenu.Item.Text value={Constants.MyProfile} />
              </SideMenu.SubMenu.Item>
              <SideMenu.SubMenu.Item isUsed={false} onClick={() => { }}>
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


export function loader(queryClient: QueryClient) {
  return async function() {
    try {
      const query = userDetailsQuery;
      await queryClient.ensureQueryData(query);
      return true;
    } catch (error: unknown) {
      return false;
    }
  }
}

export default ProfileLayout;


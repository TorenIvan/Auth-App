import { Fragment, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import {
  faCircleUser,
  faRightFromBracket,
  faUserGroup,
} from "@fortawesome/free-solid-svg-icons";
import { Footer, Header, Main } from "../../../layouts";
import { SideMenu } from "../components";
import { Constants } from "../constants";
import { useToggleSubMenu } from "../hooks";
import { userDetailsQuery } from "../api";
import { BroadcastChannel } from "broadcast-channel";
import { Errors } from "../errors";
import { queryClient } from "../../../config";
import { useAuth } from "../../../store";

function ProfileLayout() {
  const { logout: logoutContext } = useAuth();
  const [isSubMenuOpen, toggleSubMenu] = useToggleSubMenu();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const logoutChannel = new BroadcastChannel("logout");

  function logout() {
    logoutChannel.postMessage("logout");
  }

  const logoutAllTabs = () => {
    logoutChannel.onmessage = async () => {
      try {
        await logoutContext(queryClient);
        logoutChannel.close();
        return navigate("/login");
      } catch (error) {
        console.error(error);
        toast.error(Errors.GenericError);
        return undefined;
      }
    };
  };

  useEffect(() => {
    logoutAllTabs();
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

export function loader() {
  return async function () {
    try {
      console.log('Mpika loader profile');
      
      const query = userDetailsQuery;
      const data = await queryClient.ensureQueryData(query);
      console.log({ data });
      queryClient.setQueryData(query.queryKey, data);
      return true;
    } catch (error: unknown) {
      console.error(error);
      return false;
    }
  };
}

export default ProfileLayout;

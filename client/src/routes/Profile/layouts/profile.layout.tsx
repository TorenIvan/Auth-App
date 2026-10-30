import { Fragment } from 'react';
import { Outlet } from 'react-router';
import { faCircleUser, faPowerOff, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { Header, Main, Footer } from '../../../layouts';
import { useToggleSubMenu } from '../hooks';
import { Constants } from '../../../utils';
import { SideMenu } from '../components';
import { useLogoutAllMutation, useLogoutMutation } from '../../Auth/hooks';

export function ProfileLayout() {
  const { logout } = useLogoutMutation();
  const { logoutAll } = useLogoutAllMutation();
  const [isSubMenuOpen, toggleSubMenu] = useToggleSubMenu();

  /**
   * *** The other tabs are notified by the auth channel (see AxiosInterceptor) ***
   */
  function handleLogout() {
    logout();
  }

  function handleLogoutAllDevices() {
    if (window.confirm(Constants.ConfirmLogoutAllDevices)) {
      logoutAll();
    }
  }

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
              {/* <SideMenu.SubMenu.Item isUsed={false} onClick={() => {}}>
                <SideMenu.SubMenu.Item.Image icon={faUserGroup} size="lg" />
                <SideMenu.SubMenu.Item.Text value={Constants.GroupChat} />
              </SideMenu.SubMenu.Item> */}
              <SideMenu.SubMenu.Divider />
              <SideMenu.SubMenu.Item isUsed={false} onClick={handleLogout}>
                <SideMenu.SubMenu.Item.Image icon={faRightFromBracket} size="lg" color="#EB5757" />
                <SideMenu.SubMenu.Item.Text value={Constants.Logout} color="#EB5757" />
              </SideMenu.SubMenu.Item>
              <SideMenu.SubMenu.Item isUsed={false} onClick={handleLogoutAllDevices}>
                <SideMenu.SubMenu.Item.Image icon={faPowerOff} size="lg" color="#EB5757" />
                <SideMenu.SubMenu.Item.Text value={Constants.LogoutAllDevices} color="#EB5757" />
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

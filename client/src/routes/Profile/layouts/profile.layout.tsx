import { Fragment, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { BroadcastChannel } from 'broadcast-channel';
import { faCircleUser, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { Header, Main, Footer } from '../../../layouts';
import { useToggleSubMenu } from '../hooks';
import { Constants } from '../../../utils';
import { SideMenu } from '../components';
import { useLogoutMutation } from '../../Auth/hooks';

export function ProfileLayout() {
  const { logout } = useLogoutMutation();
  const [isSubMenuOpen, toggleSubMenu] = useToggleSubMenu();
  const logoutChannel = new BroadcastChannel('logout');

  useEffect(() => {
    logoutChannel.onmessage = async () => {
      await logout();
      logoutChannel.close();
    };

    return () => {
      logoutChannel.close();
    };
  }, []);

  function handleLogout() {
    logoutChannel.postMessage('logout');
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

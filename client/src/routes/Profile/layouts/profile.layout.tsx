import { Fragment, useState } from "react";
import { Outlet } from "react-router-dom";
import { Footer, Header, Main } from "../../../layouts";
import { SideMenu } from "../components";

function ProfileLayout() {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState<boolean>(true);

  return (
    <Fragment>
      <Header
        rightSlot={
          <SideMenu
            isOpen={isSideMenuOpen}
            onPressingOpenButton={() =>
              setIsSideMenuOpen((isSideMenuOpen) => !isSideMenuOpen)
            }
          >
            <SideMenu.Item isUsed onClick={() => {}}>
              <SideMenu.Item.Content image="" value="" color="red" />
            </SideMenu.Item>
            <SideMenu.Item isUsed={false} onClick={() => {}}>
              <SideMenu.Item.Content image="" value="" color="red" />
            </SideMenu.Item>
            <SideMenu.Item isUsed={false} onClick={() => {}}>
              <SideMenu.Item.Content image="" value="" color="red" />
            </SideMenu.Item>
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

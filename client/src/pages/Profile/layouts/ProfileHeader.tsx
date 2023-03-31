import { useState } from "react";
import { LogoIcon, SideMenu } from "../components";
import styles from "./styles.module.scss";

function ProfileHeader(): JSX.Element {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState<boolean>(true);

  return (
    <div className={styles["developer-information"]}>
      <LogoIcon />
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
    </div>
  );
}

export default ProfileHeader;

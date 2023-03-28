import { useAtom } from "jotai";
import { useState } from "react";
import { themeAtom } from "../../../store";
import { ThemeIcon, UserAvatar, SideMenu } from "../components";
import styles from "./styles.module.scss";

function ProfileHeader(): JSX.Element {
  const [theme, _] = useAtom(themeAtom);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState<boolean>(false);

  return (
    <div className={styles["developer-information"]}>
      <ThemeIcon theme={theme} />
      <div className={styles["avatar-select-container"]}>
        <UserAvatar theme={theme} />
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
    </div>
  );
}

export default ProfileHeader;

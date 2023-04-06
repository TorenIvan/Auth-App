import React, { ReactNode } from "react";
import { useTheme } from "../../hooks";
import { LogoIcon, ThemeIcon } from "../../icons";
import styles from "./styles.module.scss";

interface IProps {
  rightSlot?: ReactNode;
}

function Header({ rightSlot }: IProps) {
  const [theme, toggleTheme] = useTheme();

  const handleThemeIconClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    toggleTheme();
  };
  return (
    <div className={styles["container"]}>
      <LogoIcon />
      <div className={styles["developer-information"]}>
        <div className={styles.toggleButton} onClick={handleThemeIconClick}>
          <ThemeIcon theme={theme} />
        </div>
        {rightSlot}
      </div>
    </div>
  );
}

export default Header;

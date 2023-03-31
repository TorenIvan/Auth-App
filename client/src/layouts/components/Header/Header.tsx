import React, { ReactNode } from "react";
import { useTheme } from "../../../hooks";
import { LogoIcon, ThemeIcon } from "../../../icons";
import styles from "./styles.module.scss";

interface IProps {
  rightElement?: ReactNode;
}

function Header({ rightElement }: IProps) {
  const [theme, toggleTheme] = useTheme();

  const handleThemeIconClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    toggleTheme();
  };
  return (
    <div className={styles["developer-information"]}>
      <LogoIcon />
      <button className={styles.toggleButton} onClick={handleThemeIconClick}>
        <ThemeIcon theme={theme} />
      </button>
      {rightElement}
    </div>
  );
}

export default Header;

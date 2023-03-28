import React from "react";
import { useTheme } from "../../hooks";
import { ThemeIcon } from "../../icons";
import styles from "./styles.module.scss";

function Header() {
  const [theme, toggleTheme] = useTheme();

  const handleThemeIconClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    toggleTheme();
  };
  return (
    <button className={styles.toggleButton} onClick={handleThemeIconClick}>
      <ThemeIcon theme={theme} />
    </button>
  );
}

export default Header;

import React from "react";
import { Atom, useAtom } from "jotai";
import { useTheme } from "../../hooks";
import { ThemeIcon } from "../../icons";
import Constants from "../../utils/Constants";
import { isThemeDarkAtom } from "../../store";
import styles from "./styles.module.scss";

function Header() {
  const [theme, toggleTheme] = useTheme(Constants.LightPalette);

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

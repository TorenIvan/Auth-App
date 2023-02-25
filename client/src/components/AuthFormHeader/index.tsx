import { memo } from "react";
import headerStyles from "./styles.module.css";
import Constants from "../../utils/Constants";

const Header = ({ title }: { title: JSX.Element }): JSX.Element => {
  return (
    <header className={headerStyles.header}>
      <div>{title}</div>
      <h4>{Constants.FormHeader}</h4>
    </header>
  );
};

export default memo(Header);

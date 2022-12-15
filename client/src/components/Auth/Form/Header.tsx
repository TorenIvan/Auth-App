import { memo } from "react";
import "../authStyles.module.css";
import headerStyles from "../authHeader.module.css";
import Constants from "../../../utils/Constants";

const Header = ({ title }: { title: JSX.Element }): JSX.Element => {
  return (
    <header className={headerStyles.header}>
      {title}
      <h4>{Constants.FormHeader}</h4>
    </header>
  );
};

export default memo(Header);

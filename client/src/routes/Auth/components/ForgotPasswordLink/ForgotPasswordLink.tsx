import { NavLink } from "react-router-dom";
import { Constants } from "../../constants";
import styles from "./styles.module.css";

const ForgotPasswordLink = (): JSX.Element => {
  return (
    <div id={styles["link-container"]}>
      <NavLink to="/forgot-password" end className={styles["link"]}>
        {Constants.ForgotPasswordLink}
      </NavLink>
    </div>
  );
};

export { ForgotPasswordLink };

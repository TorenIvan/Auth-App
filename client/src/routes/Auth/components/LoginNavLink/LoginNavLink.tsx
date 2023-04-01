import { NavLink } from "react-router-dom";
import { Constants } from "../../constants";
import styles from "./styles.module.css";

const LoginNavLink = (): JSX.Element => {
  return (
    <p id={styles["social-profiles-text"]}>
      <span>{Constants.DontHaveAnAccount}&nbsp;&nbsp;&nbsp;</span>
      <NavLink
        to="/register"
        style={{
          color: "#545e6f",
        }}
      >
        {Constants.Register}
      </NavLink>
    </p>
  );
};

export default LoginNavLink;

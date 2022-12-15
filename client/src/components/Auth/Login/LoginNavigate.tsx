import { NavLink } from "react-router-dom";
import styles from "../authStyles.module.css";

const LoginNavigate = (): JSX.Element => {
  return (
    <p id={styles["social-profiles-text"]}>
      <span>Dont have an account yet?&nbsp;&nbsp;&nbsp;</span>
      <NavLink
        to="/register"
        style={{
          color: "#545e6f",
        }}
      >
        Register
      </NavLink>
    </p>
  );
};

export default LoginNavigate;

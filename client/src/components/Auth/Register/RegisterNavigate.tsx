import { NavLink } from "react-router-dom";
import styles from "../authStyles.module.css";

const RegisterNavigate = (): JSX.Element => {
  return (
    <p id={styles["social-profiles-text"]}>
      <span>Already a member?&nbsp;&nbsp;&nbsp;</span>
      <NavLink
        to="/login"
        style={{
          color: "#545e6f",
        }}
      >
        Login
      </NavLink>
    </p>
  );
};

export default RegisterNavigate;

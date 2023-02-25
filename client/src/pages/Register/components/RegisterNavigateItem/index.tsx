import { NavLink } from "react-router-dom";
import Constants from "../../../../utils/Constants";
import styles from "./styles.module.css";

const RegisterNavigate = (): JSX.Element => {
  return (
    <p id={styles["social-profiles-text"]}>
      <span>{Constants.AlreadyAMember}&nbsp;&nbsp;&nbsp;</span>
      <NavLink
        to="/login"
        style={{
          color: "#545e6f",
        }}
      >
        {Constants.Login}
      </NavLink>
    </p>
  );
};

export default RegisterNavigate;

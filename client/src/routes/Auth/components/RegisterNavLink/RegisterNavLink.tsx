import { NavLink } from "react-router-dom";
import { Constants } from "../../constants";
import styles from "./styles.module.css";

const RegisterNavLink = (): JSX.Element => {
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

export default RegisterNavLink;

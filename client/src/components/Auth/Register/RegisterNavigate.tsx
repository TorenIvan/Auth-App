import { NavLink } from "react-router-dom";
import "../authStyles.css";

const RegisterNavigate = (): JSX.Element => {
  return (
    <p>
      Already a member? <NavLink to="/login">Login</NavLink>
    </p>
  );
};

export default RegisterNavigate;

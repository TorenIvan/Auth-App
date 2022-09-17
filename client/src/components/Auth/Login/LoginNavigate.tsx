import { NavLink } from "react-router-dom";
import "../authStyles.module.css";

const LoginNavigate = (): JSX.Element => {
  return (
    <p>
      Dont have an account yet? <NavLink to="/register">Register</NavLink>
    </p>
  );
};

export default LoginNavigate;

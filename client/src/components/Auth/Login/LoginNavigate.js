import { NavLink } from "react-router-dom";
import "../authStyles.css";

const LoginNavigate = () => {
  return (
    <p>
      Dont have an account yet? <NavLink to="/register">Register</NavLink>
    </p>
  );
};

export default LoginNavigate;

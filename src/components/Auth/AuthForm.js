import { NavLink } from "react-router-dom";
import "./authStyles.css";
import "font-awesome/css/font-awesome.min.css";
import {
  Facebook_icon,
  Twitter_icon,
  Github_icon,
  Google_icon,
} from "../../assets/index";

const AuthForm = props => {
  const { type } = props;
  return (
    <div className="screen-container">
      <div id="main-container">
        <div className="main-wrapper">
          {type == "Register" ? (
            <header>
              <h2>
                Join thousands of learners from
                <br />
                around the world
              </h2>
              <h4>
                Master web development by making real-life
                <br />
                projects. There are multiple paths for you to
                <br />
                choose.
              </h4>
            </header>
          ) : (
            <header>
              <h2>Sign In</h2>
              <h4>
                Master web development by making real-life
                <br />
                projects. There are multiple paths for you to
                <br />
                choose.
              </h4>
            </header>
          )}
          <form className="auth-container">
            <div className="auth-item">
              <input
                id="email"
                type="email"
                placeholder="&#xf0e0; Email"
                pattern="[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{1,63}$"
                required
              />
            </div>
            <div className="auth-item">
              <input
                id="password"
                type="password"
                placeholder="&#xf06e; Password"
                required
              />
            </div>
            <div id="submitBox">
              <input type="submit" value="Register Now!"></input>
            </div>
          </form>
          <footer>
            <div className="social-profile-paragraph">
              <p>or continue with these social profiles</p>
            </div>
            <ul id="social-profiles">
              <li className="social-item">
                <Google_icon />
              </li>
              <li className="social-item">
                <Facebook_icon />
              </li>
              <li className="social-item">
                <Github_icon />
              </li>
              <li className="social-item">
                <Twitter_icon />
              </li>
            </ul>
            {type == "Register" ? (
              <div className="social-login">
                <p>
                  Already a member? <NavLink to="/login">Login</NavLink>
                </p>
              </div>
            ) : (
              <div className="social-login">
                <p>
                  Dont have an account yet?{" "}
                  <NavLink to="/register">Register</NavLink>
                </p>
              </div>
            )}
          </footer>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;

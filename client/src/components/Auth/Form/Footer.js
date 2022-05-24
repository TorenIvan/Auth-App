import {
    FacebookIcon,
    TwitterIcon,
    GithubIcon,
    GoogleIcon,
  } from "../../../assets/index";
import { memo } from "react";
import "font-awesome/css/font-awesome.min.css";
import "../authStyles.css";

const Footer = ({navigateParagraph}) => {
  return (
    <footer>
      <div className="social-profile-paragraph">
        <p>or continue with these social profiles</p>
      </div>
      <ul id="social-profiles">
        <li className="social-item">
          <GoogleIcon />
        </li>
        <li className="social-item">
          <FacebookIcon />
        </li>
        <li className="social-item">
          <GithubIcon />
        </li>
        <li className="social-item">
          <TwitterIcon />
        </li>
      </ul>
      <div className="social-login">
        {navigateParagraph}
      </div>
    </footer>
  );
};

export default memo(Footer);

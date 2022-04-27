import {
    Facebook_icon,
    Twitter_icon,
    Github_icon,
    Google_icon,
  } from "../../../assets/index";
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
      <div className="social-login">
        {navigateParagraph}
      </div>
    </footer>
  );
};

export default Footer;

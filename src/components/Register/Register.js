import { Component } from "react";
import "./Register.css";
import "font-awesome/css/font-awesome.min.css";

class Register extends Component {
  render() {
    return (
      <div className="screen-container">
        <div id="main-container">
          <div className="main-wrapper">
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
            <form className="auth-container">
              <div className="auth-item">
                <input
                  id="email"
                  type="email"
                  placeholder="&#xf0e0; Email"
                  pattern="[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{1,63}$"
                  required=""
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
              <p>kati</p>
            </footer>
          </div>
        </div>
      </div>
    );
  }
}

export default Register;

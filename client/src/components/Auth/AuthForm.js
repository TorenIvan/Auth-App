import { useState, memo } from "react";
import "./authStyles.css";

const AuthForm = props => {
  const { onSubmit, header, footer } = props;
  const [formValue, setFormValue] = useState({email: "", password: ""});

  const handleChange = event => {
    const {type, value} = event.target;
    setFormValue(prevState => ({...prevState, [type]: value}));
  }

  const handleSubmit = event => {
    event.preventDefault();
    //validate common (Login/Register) things
    onSubmit(JSON.stringify(formValue));
  }
  
  const {email, password} = formValue;
  return (
    <div className="screen-container">
      <div id="main-container">
        <div className="main-wrapper">
          {header}
          <form className="auth-container" onSubmit={handleSubmit}>
            <div className="auth-item">
              <input
                id="email"
                type="email"
                placeholder="&#xf0e0; Email"
                pattern="[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{1,63}$"
                required
                onChange={handleChange}
                value={email}
              />
            </div>
            <div className="auth-item">
              <input
                id="password"
                type="password"
                placeholder="&#xf06e; Password"
                autoComplete="new-password"
                required
                onChange={handleChange}
                value={password}
              />
            </div>
            <div id="submitBox">
              <input type="submit" value="Register Now!"></input>
            </div>
          </form>
          {footer}
        </div>
      </div>
    </div>
  );
};

export default memo(AuthForm);

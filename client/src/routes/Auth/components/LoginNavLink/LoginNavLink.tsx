import { NavLink } from 'react-router-dom';
import styles from './styles.module.css';
import { Constants } from '../../../../utils';

const LoginNavLink = (): JSX.Element => {
  return (
    <p id={styles['social-profiles-text']}>
      <span>{Constants.DontHaveAnAccount}&nbsp;&nbsp;&nbsp;</span>
      <NavLink
        to="/register"
        end
        style={{
          color: '#545e6f',
        }}
      >
        {Constants.Register}
      </NavLink>
    </p>
  );
};

export default LoginNavLink;

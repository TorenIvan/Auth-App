import type { JSX } from 'react';
import { NavLink } from 'react-router';
import styles from './styles.module.css';
import { Constants } from '../../../../utils';

const ForgotPasswordLink = (): JSX.Element => {
  return (
    <div id={styles['link-container']}>
      <NavLink to="/forgot-password" end className={styles['link']}>
        {Constants.ForgotPasswordLink}
      </NavLink>
    </div>
  );
};

export { ForgotPasswordLink };

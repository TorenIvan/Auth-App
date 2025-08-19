import { memo } from 'react';
import styles from './styles.module.scss';

function Divider(): JSX.Element {
  return <hr className={styles.divider}></hr>;
}

export default memo(Divider);

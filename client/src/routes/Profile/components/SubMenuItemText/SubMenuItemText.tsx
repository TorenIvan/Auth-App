import { memo } from 'react';
import styles from './styles.module.scss';

function SubMenuItemText({ value, color }: IProps): JSX.Element {
  return (
    <span className={styles.text} style={color !== undefined ? { color: color } : {}}>
      {value}
    </span>
  );
}

export default memo(SubMenuItemText);

interface IProps {
  value: string;
  color?: string;
}

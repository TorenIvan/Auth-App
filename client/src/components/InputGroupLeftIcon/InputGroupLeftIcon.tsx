import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome';

function InputGroupLeftIcon(props: IProps) {
  const { icon, styles } = props;
  return <FontAwesomeIcon icon={icon} className={styles} />;
}

export default InputGroupLeftIcon;

interface IProps {
  icon: IconProp;
  styles: FontAwesomeIconProps['className'];
}

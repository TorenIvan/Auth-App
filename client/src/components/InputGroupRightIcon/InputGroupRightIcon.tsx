import { IconProp } from "@fortawesome/fontawesome-svg-core";
import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from "@fortawesome/react-fontawesome";

function InputGroupRightIcon(props: IProps) {
  const { icon, styles, handleClick } = props;
  return (
    <FontAwesomeIcon icon={icon} className={styles} onClick={handleClick} />
  );
}

export default InputGroupRightIcon;

interface IProps {
  icon: IconProp;
  styles: FontAwesomeIconProps["className"];
  handleClick: () => void;
}

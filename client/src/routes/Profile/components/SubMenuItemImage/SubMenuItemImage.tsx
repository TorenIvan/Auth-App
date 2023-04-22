import { memo } from "react";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./styles.module.scss";
import { SizeProp } from "@fortawesome/fontawesome-svg-core";

function SubMenuItemImage({ icon, size, color }: IProps): JSX.Element {
  return (
    <FontAwesomeIcon
      icon={icon}
      className={styles["account-menu-icon"]}
      style={color !== undefined ? { color: color } : {}}
      size={size}
    />
  );
}

export default memo(SubMenuItemImage);

interface IProps {
  icon: IconDefinition;
  size: SizeProp;
  color?: string;
}

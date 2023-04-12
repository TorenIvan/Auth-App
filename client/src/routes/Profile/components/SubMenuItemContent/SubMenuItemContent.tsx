import { Fragment, memo } from "react";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./styles.module.scss";

function SubMenuItemContent({ icon, value, color }: IProps): JSX.Element {
  console.log("color: ", color);
  return (
    <Fragment>
      <FontAwesomeIcon
        icon={icon}
        className={styles["account-menu-icon"]}
        style={color !== undefined ? { color: color } : {}}
        size="lg"
      />
      <span style={color !== undefined ? { color: color } : {}}>{value}</span>
    </Fragment>
  );
}

export default memo(SubMenuItemContent);

interface IProps {
  icon: IconDefinition;
  value: string;
  color?: string;
}

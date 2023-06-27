import { NavLink } from "react-router-dom";
import styles from "./styles.module.css";

const LoginNavLink = (props: IProps): JSX.Element => {
  const { note, sidenote } = props;
  let sidenoteSlot: JSX.Element | null = null;
  if (sidenote !== undefined) {
    sidenoteSlot = <span>{sidenote}&nbsp;&nbsp;&nbsp;</span>;
  }
  return (
    <p id={styles["social-profiles-text"]}>
      {sidenoteSlot}
      <NavLink
        to="/register"
        style={{
          color: "#545e6f",
        }}
      >
        {note}
      </NavLink>
    </p>
  );
};

export default LoginNavLink;

interface IProps {
  note: string;
  sidenote?: string;
}

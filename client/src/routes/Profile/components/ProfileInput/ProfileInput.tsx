import styles from "./styles.module.scss";
import { inputStyles } from "../../../../styles";
import { useHidePassword } from "../../../Auth/hooks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

export function ProfileInput(props: IProps): JSX.Element {
  const [hidePassword, togglePasswordVisibility] = useHidePassword();
  const { label, attributes, isPassword } = props;

  function handleFocus(event: React.FocusEvent<HTMLInputElement>) {
    event.target.removeAttribute("readOnly");
  }

  let type: string = "text";
  let iconSlot: JSX.Element | null = null;

  if (isPassword === true) {
    iconSlot = (
      <FontAwesomeIcon
        icon={hidePassword === true ? faEye : faEyeSlash}
        className={inputStyles["fa-eye-middle"]}
        onClick={togglePasswordVisibility}
      />
    );
    if (hidePassword === true) {
      type = "password";
    }
  }

  return (
    <section className={styles["input-container"]}>
      <label>{label}</label>
      <input
        className={inputStyles.input}
        {...attributes}
        type={type}
        readOnly
        onFocus={handleFocus}
      />
      {iconSlot}
    </section>
  );
}

interface IProps {
  label: string;
  attributes: IAttributes;
  isPassword?: boolean;
}

interface IAttributes {
  placeholder: string;
  autocomplete?: string;
  value?: string;
}

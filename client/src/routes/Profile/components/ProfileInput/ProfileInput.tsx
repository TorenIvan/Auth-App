import { Input, PasswordInput } from "../../../../components";
import { inputStyles } from "../../../../styles";
import styles from "./styles.module.scss";

export function ProfileInput(props: IProps): JSX.Element {
  const { isPassword, ...restProps } = props;

  const inputSlot =
    isPassword === true ? (
      <PasswordInput {...restProps} iconStyles={inputStyles["fa-eye-middle"]} />
    ) : (
      <Input {...restProps} />
    );

  return <section className={styles["input-container"]}>{inputSlot}</section>;
}

interface IProps {
  label: string;
  attributes: IAttributes;
  isPassword?: boolean;
}

interface IAttributes {
  placeholder: string;
  autoComplete?: string;
  defaultValue?: string;
}

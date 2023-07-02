import { useHidePassword } from "../../hooks";
import InputGroupInput from "../InputGroupInput";
import InputGroupLabel from "../InputGroupLabel";
import InputGroupLeftIcon from "../InputGroupLeftIcon";
import InputGroupRightIcon from "../InputGroupRightIcon";
import styles from "./styles.module.scss";

function InputGroup(props: IProps): JSX.Element {
  const [hidePassword, togglePasswordVisibility] = useHidePassword();
  const { stylesContainer, children } = props;
  const containerClassName = stylesContainer ? styles[stylesContainer] : "";

  console.log(containerClassName);
  if (typeof children === "function") {
    return (
      <section className={containerClassName}>
        {children({ hidePassword, togglePasswordVisibility })}
      </section>
    );
  }

  return <section className={containerClassName}>{children}</section>;
}

export default InputGroup;

InputGroup.Label = InputGroupLabel;
InputGroup.LeftIcon = InputGroupLeftIcon;
InputGroup.RightIcon = InputGroupRightIcon;
InputGroup.Input = InputGroupInput;

interface IProps {
  stylesContainer?: string;
  children: JSX.Element | ((childrenProps: IChildrenProps) => JSX.Element);
}

interface IChildrenProps {
  hidePassword: boolean;
  togglePasswordVisibility: () => void;
}

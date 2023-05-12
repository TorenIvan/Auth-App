import React from "react";
import "font-awesome/css/font-awesome.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useHidePassword } from "../../hooks";
import { inputStyles } from "../../styles";

function PasswordInput(props: IProps): JSX.Element {
  const [hidePassword, togglePasswordVisibility] = useHidePassword();
  const { attributes, iconStyles, label, ref } = props;

  function handleFocus(event: React.FocusEvent<HTMLInputElement>) {
    event.preventDefault();
    event.currentTarget.removeAttribute("readOnly");
  }

  const iconSlot = (
    <FontAwesomeIcon
      icon={hidePassword === true ? faEye : faEyeSlash}
      className={iconStyles}
      onClick={togglePasswordVisibility}
    />
  );
  const labelSlot: JSX.Element | null =
    label !== undefined ? <label>{label}</label> : null;
  const type: string = hidePassword === true ? "password" : "text";

  return (
    <>
      {labelSlot}
      <input
        className={inputStyles.input}
        ref={ref}
        {...attributes}
        onFocus={handleFocus}
        type={type}
      />
      {iconSlot}
    </>
  );
}

export default PasswordInput;

interface IProps {
  attributes: React.InputHTMLAttributes<HTMLInputElement>;
  iconStyles: string;
  label?: string;
  ref?: React.RefObject<HTMLInputElement>;
}

import React from "react";
import "font-awesome/css/font-awesome.min.css";
import { inputStyles } from "../../styles";

function Input({ attributes, label, ref }: IProps): JSX.Element {
  const labelSlot: JSX.Element | null =
    label !== undefined ? <label>{label}</label> : null;

  return (
    <>
      {labelSlot}
      <input className={inputStyles.input} ref={ref} {...attributes} />
    </>
  );
}

export default Input;

interface IProps {
  attributes: React.InputHTMLAttributes<HTMLInputElement>;
  label?: string;
  ref?: React.RefObject<HTMLInputElement>;
}

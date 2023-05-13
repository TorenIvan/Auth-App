import React, { ForwardedRef, forwardRef } from "react";
import "font-awesome/css/font-awesome.min.css";
import { inputStyles } from "../../styles";

const Input = forwardRef<HTMLInputElement, IProps>(
  (props, ref?: TRef): JSX.Element => {
    const { attributes, label } = props;
    const labelSlot: JSX.Element | null =
      label !== undefined ? <label>{label}</label> : null;

    return (
      <>
        {labelSlot}
        <input className={inputStyles.input} ref={ref} {...attributes} />
      </>
    );
  }
);

export default Input;

interface IProps {
  attributes: React.InputHTMLAttributes<HTMLInputElement>;
  label?: string;
}

type TRef = ForwardedRef<HTMLInputElement>;

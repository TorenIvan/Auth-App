import { memo } from "react";
import headerStyles from "./styles.module.css";
import Constants from "../../../utils/Constants";

interface IProps {
  titleSlot: JSX.Element;
}

const AuthFormHeader = ({ titleSlot }: IProps) => {
  return (
    <header className={headerStyles.header}>
      <div>{titleSlot}</div>
      <h4>{Constants.FormHeader}</h4>
    </header>
  );
};

export default memo(AuthFormHeader);

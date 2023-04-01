import { memo } from "react";
import { Constants } from "../../../constants";
import headerStyles from "./styles.module.css";

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

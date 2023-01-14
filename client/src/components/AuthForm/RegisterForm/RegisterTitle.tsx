import Constants from "../../../utils/Constants";
import "../Styles/authStyles.module.css";

const RegisterTitle = (): JSX.Element => {
  return (
    <h2>
      {Constants.JoinLearners}
      <br />
      {Constants.AroundTheWorld}
    </h2>
  );
};

export default RegisterTitle;

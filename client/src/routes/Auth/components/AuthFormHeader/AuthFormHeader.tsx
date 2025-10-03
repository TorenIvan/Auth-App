import { Constants } from '../../../../utils';
import headerStyles from './AuthFormHeader.module.scss';

function AuthFormHeader(props: IProps): JSX.Element {
  const { titleSlot } = props;

  return (
    <header className={headerStyles.header}>
      <div>{titleSlot}</div>
      <h4>{Constants.FormHeader}</h4>
    </header>
  );
}

export default AuthFormHeader;

interface IProps {
  titleSlot: JSX.Element;
}

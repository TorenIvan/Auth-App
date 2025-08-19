import AuthFormHeader from '../AuthFormHeader';
import AuthFormFooter from '../AuthFormFooter';
import AuthForm from '../AuthForm';
import formStyles from './AuthFormGroup.module.scss';

function AuthFormGroup(props: IProps): JSX.Element {
  const { children } = props;

  return (
    <div id={formStyles['main-container']}>
      <div className={formStyles['main-wrapper']}>{children}</div>
    </div>
  );
}

export default AuthFormGroup;

AuthFormGroup.Header = AuthFormHeader;
AuthFormGroup.Form = AuthForm;
AuthFormGroup.Footer = AuthFormFooter;

interface IProps {
  children?: JSX.Element;
}

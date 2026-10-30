import { DefaultError } from '../../utils';
import errorStyles from './styles.module.scss';

function ErrorPage(props: IProps) {
  const {
    image = DefaultError.image,
    title = DefaultError.title,
    body = DefaultError.body,
  } = props;
  return (
    <div className={errorStyles.ErrorContainer}>
      <div id={errorStyles['image-container']}>
        <img src={image} alt="ErrorInfoImage" loading="lazy" />
      </div>
      <div id={errorStyles['text-container']}>
        <h2 id={errorStyles['title']}>{title}</h2>
        <p id={errorStyles['body']}>{body}</p>
      </div>
    </div>
  );
}

export default ErrorPage;

interface IProps {
  image?: string;
  title?: string;
  body?: string;
}

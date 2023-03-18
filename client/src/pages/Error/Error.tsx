import { DefaultError } from "../../utils/Errors";
import errorStyles from "./styles.module.scss";

interface IProps {
  image?: string;
  title?: string;
  body?: string;
}

function ErrorPage(props: IProps) {
  const { image, title, body } = props;
  return (
    <div className={errorStyles.ErrorContainer}>
      <div id={errorStyles["image-container"]}>
        <img src={image} alt="ErrorInfoImage" loading="lazy" />
      </div>
      <div id={errorStyles["text-container"]}>
        <h2 id={errorStyles["title"]}>{title}</h2>
        <p id={errorStyles["body"]}>{body}</p>
      </div>
    </div>
  );
}

ErrorPage.defaultProps = { ...DefaultError };

export default ErrorPage;

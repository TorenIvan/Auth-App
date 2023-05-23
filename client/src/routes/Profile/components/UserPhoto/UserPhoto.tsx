import { CSSProperties } from "react";
import styles from "./styles.module.scss";

export function UserPhoto(props: IProps): JSX.Element {
  const { image, handleImage, inputSlot, paragraphSlot } = props;

  const imageStyle = setImageStyle(image);
  return (
    <section
      className={`${styles["edit-photo-item"]} ${
        image === undefined ? styles["responsive"] : ""
      }`}
    >
      <section
        className={`${styles["image-container"]} ${
          image === undefined ? styles["responsive"] : ""
        }`}
        onClick={handleImage}
        style={imageStyle}
      >
        {inputSlot}
        {paragraphSlot}
      </section>
      {paragraphSlot}
    </section>
  );
}

interface IProps {
  image?: string;
  handleImage?: (_: unknown) => void;
  inputSlot?: JSX.Element;
  paragraphSlot?: JSX.Element;
}

function setImageStyle(image?: string | null): CSSProperties | undefined {
  let imageStyle: CSSProperties | undefined = undefined;
  if (image !== null && image !== undefined) {
    imageStyle = {
      backgroundImage: `url(${image})`,
    };
  }
  return imageStyle;
}

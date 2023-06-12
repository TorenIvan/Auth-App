import { CSSProperties } from "react";
import styles from "./styles.module.scss";

export function UserPhoto(props: IProps): JSX.Element {
  const { image, handleImage, inputSlot, paragraphSlot } = props;

  const imageStyle = setImageStyle(image);
  return (
    <section className={styles["edit-photo-item"]}>
      <section
        className={styles["image-container"]}
        onClick={handleImage}
        style={imageStyle}
      >
        {inputSlot}
      </section>
      {paragraphSlot}
    </section>
  );
}

interface IProps {
  image: string | null;
  handleImage?: (_: unknown) => void;
  inputSlot?: JSX.Element;
  paragraphSlot?: JSX.Element;
}

function setImageStyle(image: string | null): CSSProperties | undefined {
  let imageStyle: CSSProperties | undefined = undefined;
  if (image !== null) {
    imageStyle = {
      backgroundImage: `url(${image})`,
    };
  }
  return imageStyle;
}

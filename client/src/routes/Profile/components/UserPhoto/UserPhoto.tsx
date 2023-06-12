import { CSSProperties } from "react";
import styles from "./styles.module.scss";

export function UserPhoto(props: IProps): JSX.Element {
  const { image, handleImage, inputSlot, paragraphSlot } = props;

  const imageStyle = setImageStyle(image, handleImage !== undefined);
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

function setImageStyle(
  image: string | null,
  canEdit: boolean
): CSSProperties | undefined {
  let imageStyle: CSSProperties | undefined = undefined;
  switch (true) {
    case canEdit && image !== null:
      imageStyle = {
        backgroundImage: `url(${image})`,
        cursor: "pointer",
      };
      break;
    case canEdit:
      imageStyle = {
        cursor: "pointer",
      };
      break;
    case image !== null:
      imageStyle = {
        backgroundImage: `url(${image})`,
      };
      break;
    default:
      break;
  }
  return imageStyle;
}

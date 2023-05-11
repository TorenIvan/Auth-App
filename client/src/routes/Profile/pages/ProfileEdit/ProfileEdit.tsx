import { Form, NavLink } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Textarea } from "../../../../components";
import {
  ProfileInput as Input,
  ProfileEditItem as EditItem,
} from "../../components";
import { userDetailsQuery } from "../../api";
import styles from "./styles.module.scss";
import { Constants } from "../../constants";

function ProfileEdit() {
  const queryClient = useQueryClient();
  const { queryKey } = userDetailsQuery();
  const userInfo: TUserInfo = queryClient.getQueryData(queryKey);

  return (
    <div className={styles["page-container"]}>
      <NavLink className={styles["back-button"]} to="/profile" replace>
        <span className={styles["arrow-left"]} />
        <span>{Constants.Back}</span>
      </NavLink>
      <Form className={styles.form} autoComplete="off">
        <article>
          <h3>{Constants.ChangeInfo}</h3>
          <span>{Constants.ChangeInfoSub}</span>
        </article>
        <EditItem>
          <section className={styles["edit-photo-item"]}>
            <section id={styles["image-container"]}>
              <FontAwesomeIcon
                icon={faCamera}
                color="#ffffff"
                className={styles["edit-photo-icon"]}
              />
              <span id={styles["mobile-photo-text"]}>
                {Constants.AddPhoto.toUpperCase()}
              </span>
            </section>
            <span id={styles["default-photo-text"]}>
              {Constants.AddPhoto.toUpperCase()}
            </span>
          </section>
        </EditItem>
        <EditItem>
          <Input
            label={Constants.Name}
            attributes={{
              placeholder: Constants.NamePlaceholder,
              defaultValue: userInfo?.username,
            }}
          />
        </EditItem>
        <EditItem>
          <Textarea
            labelSlot={<label>{Constants.Bio}</label>}
            attributes={{
              placeholder: Constants.BioPlaceholder,
              defaultValue: userInfo?.biography,
            }}
          />
        </EditItem>
        <EditItem>
          <Input
            label={Constants.Phone}
            attributes={{
              placeholder: Constants.PhonePlaceholder,
              defaultValue: userInfo?.phone,
            }}
          />
        </EditItem>
        <EditItem>
          <Input
            label={Constants.Email}
            attributes={{
              placeholder: Constants.EmailPlaceholder,
              defaultValue: userInfo?.email,
            }}
          />
        </EditItem>
        <EditItem>
          <Input
            label={Constants.CurrentPassword}
            attributes={{
              placeholder: Constants.CurrentPasswordPlaceholder,
              autoComplete: "new-password",
            }}
            isPassword
          />
        </EditItem>
        <EditItem>
          <Input
            label={Constants.NewPassword}
            attributes={{
              placeholder: Constants.NewPasswordPlaceholder,
              autoComplete: "new-password",
            }}
            isPassword
          />
        </EditItem>
        <EditItem>
          <section className={styles["edit-item"]}>
            <div id={styles["save-button"]}>
              <span id={styles["save-button-text"]}>{Constants.Save}</span>
            </div>
          </section>
        </EditItem>
      </Form>
    </div>
  );
}

export default ProfileEdit;

type TUserInfo =
  | {
      username: string;
      email: string;
      phone: string;
      biography: string;
      signInMethod: string;
    }
  | undefined;

import { Fragment, useRef } from "react";
import { Form, NavLink } from "react-router-dom";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Textarea } from "../../../../components";
import { ProfileInput, ProfileEditItem as EditItem } from "../../components";
import { Constants } from "../../constants";
import { TUserInfo } from "../../types";
import { userDetailsQuery } from "../../api";
import styles from "./styles.module.scss";

function ProfileEdit() {
  const usernameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const biographyRef = useRef<HTMLTextAreaElement>(null);
  const currentPasswordRef = useRef<HTMLInputElement>(null);
  const newPasswordRef = useRef<HTMLInputElement>(null);

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
          <ProfileInput
            ref={usernameRef}
            label={Constants.Name}
            attributes={{
              placeholder: Constants.NamePlaceholder,
              defaultValue: userInfo?.username,
            }}
          />
        </EditItem>
        <EditItem>
          <Textarea
            ref={biographyRef}
            labelSlot={<label>{Constants.Bio}</label>}
            attributes={{
              placeholder: Constants.BioPlaceholder,
              defaultValue: userInfo?.biography,
            }}
          />
        </EditItem>
        <EditItem>
          <ProfileInput
            ref={phoneRef}
            label={Constants.Phone}
            attributes={{
              placeholder: Constants.PhonePlaceholder,
              defaultValue: userInfo?.phone,
            }}
          />
        </EditItem>
        <EditItem>
          <ProfileInput
            ref={emailRef}
            label={Constants.Email}
            attributes={{
              placeholder: Constants.EmailPlaceholder,
              defaultValue: userInfo?.email,
              disabled: true,
            }}
          />
        </EditItem>
        {userInfo?.signInMethod === "credentials" && (
          <Fragment>
            <EditItem>
              <ProfileInput
                ref={currentPasswordRef}
                label={Constants.CurrentPassword}
                attributes={{
                  placeholder: Constants.CurrentPasswordPlaceholder,
                  autoComplete: "new-password",
                }}
                isPassword
              />
            </EditItem>
            <EditItem>
              <ProfileInput
                ref={newPasswordRef}
                label={Constants.NewPassword}
                attributes={{
                  placeholder: Constants.NewPasswordPlaceholder,
                  autoComplete: "new-password",
                }}
                isPassword
              />
            </EditItem>
          </Fragment>
        )}
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

export { ProfileEdit as default, action };

function action(queryClient: QueryClient) {
  return async function () {
    try {
      const { queryKey } = userDetailsQuery();
      queryClient.invalidateQueries(queryKey);
    } catch (e) {
      /* handle error */
    }
  };
}

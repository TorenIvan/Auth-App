import { Fragment, useRef } from "react";
import { NavLink } from "react-router-dom";
import {
  faCamera,
  faEnvelope,
  faEye,
  faEyeSlash,
  faLock,
  faPhone,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GlobalConstants } from "../../../../utils";
import { InputGroup, Textarea } from "../../../../components";
import { inputStyles } from "../../../../styles";
import { Constants } from "../../constants";
import { isEditFormValid as isFormValid } from "../../helpers";
import { ProfileEditItem as EditItem, UserPhoto } from "../../components";
import { useEditUserDataMutation, useImageChange, useRetrieveUserDataQuery } from "../../hooks";
import styles from "./styles.module.scss";

export function ProfileEdit() {
  const { userInfo, isFetching } = useRetrieveUserDataQuery();
  const { editUser, isMutating } = useEditUserDataMutation();
 
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [image, handleImageChange] = useImageChange(userInfo?.image);

  function triggerImageChange() {
    inputFileRef?.current?.click();
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData();

    const file = inputFileRef.current?.files?.[0];
    if (file) {
      formData.append("file", file);
    }

    formData.append("username", (form.username.value as string) || "");
    formData.append("biography", (form.biography.value as string) || "");
    formData.append("phone", (form.phone.value as string) || "");
    formData.append("currentPassword", form.currentPassword.value || "");
    formData.append("newPassword", form.newPassword.value || "");

    if (isFormValid(formData) === false) return;
    editUser(formData);
  }

  if (isFetching === false && userInfo === undefined) return undefined;
  return (
    <div className={styles["page-container"]}>
      <NavLink className={styles["back-button"]} to="/profile" end replace>
        <span className={styles["arrow-left"]} />
        <span>{Constants.Back}</span>
      </NavLink>
      <form
        className={styles.form}
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <article>
          <h3>{Constants.ChangeInfo}</h3>
          <span>{Constants.ChangeInfoSub}</span>
        </article>
        {
          isFetching ? (
            <div className={`avatar-skeleton xl ${styles['margin-loader']}`} />
          ): (
            <UserPhoto
              image={image}
              handleImage={triggerImageChange}
              inputSlot={
                <>
                  <FontAwesomeIcon
                    icon={faCamera}
                    color="#ffffff"
                    className={styles["edit-photo-icon"]}
                  />
                  <input
                    type="file"
                    name="file"
                    accept=".png, .jpg, .jpeg"
                    ref={inputFileRef}
                    onChange={handleImageChange}
                  />
                </>
              }
              paragraphSlot={
                <span
                  id={styles["default-photo-text"]}
                  onClick={triggerImageChange}
                >
                  {image === null
                    ? Constants.AddPhoto.toUpperCase()
                    : Constants.ChangePhoto.toUpperCase()}
                </span>
              }
            />
          )
        }
        <EditItem>
          <InputGroup stylesContainer="profile-input-container">
            <Fragment>
              <InputGroup.LeftIcon
                icon={faUser}
                styles={inputStyles["fa-lock-middle"]}
              />
              <InputGroup.Label value={Constants.Name} />
              <InputGroup.Input
                isLoading={isFetching}
                attributes={{
                  name: "username",
                  placeholder: Constants.NamePlaceholder,
                  defaultValue: userInfo?.username,
                }}
              />
            </Fragment>
          </InputGroup>
        </EditItem>
        <EditItem>
          <Textarea
            labelSlot={<label>{Constants.Bio}</label>}
            isLoading={isFetching}
            attributes={{
              name: "biography",
              placeholder: Constants.BioPlaceholder,
              defaultValue: userInfo?.biography,
            }}
          />
        </EditItem>
        <EditItem>
          <InputGroup stylesContainer="profile-input-container">
            <Fragment>
              <InputGroup.LeftIcon
                icon={faPhone}
                styles={inputStyles["fa-lock-middle"]}
              />
              <InputGroup.Label value={Constants.Phone} />
              <InputGroup.Input
                isLoading={isFetching}
                attributes={{
                  name: "phone",
                  placeholder: Constants.PhonePlaceholder,
                  defaultValue: userInfo?.phone,
                }}
              />
            </Fragment>
          </InputGroup>
        </EditItem>
        <EditItem>
          <InputGroup stylesContainer="profile-input-container">
            <Fragment>
              <InputGroup.LeftIcon
                icon={faEnvelope}
                styles={inputStyles["fa-lock-middle"]}
              />
              <InputGroup.Label value={Constants.Email} />
              <InputGroup.Input
                isLoading={isFetching}
                attributes={{
                  placeholder: Constants.EmailPlaceholder,
                  defaultValue: userInfo?.email,
                  disabled: true,
                }}
              />
            </Fragment>
          </InputGroup>
        </EditItem>
        {userInfo?.signInMethod === GlobalConstants.Credentials && (
          <Fragment>
            <EditItem>
              <InputGroup stylesContainer="profile-input-container">
                {({ hidePassword, togglePasswordVisibility }) => (
                  <Fragment>
                    <InputGroup.LeftIcon
                      icon={faLock}
                      styles={inputStyles["fa-lock-middle"]}
                    />
                    <InputGroup.Label value={Constants.CurrentPassword} />
                    <InputGroup.Input
                      isLoading={isFetching}
                      attributes={{
                        name: "currentPassword",
                        placeholder: Constants.CurrentPasswordPlaceholder,
                        autoComplete: "new-password",
                        type: hidePassword === true ? "password" : "text",
                      }}
                      readonlyFocusEnabled
                      preventCopyPasteEnabled
                    />
                    <InputGroup.RightIcon
                      icon={hidePassword === true ? faEye : faEyeSlash}
                      styles={inputStyles["fa-eye-middle"]}
                      handleClick={togglePasswordVisibility}
                    />
                  </Fragment>
                )}
              </InputGroup>
            </EditItem>
            <EditItem>
              <InputGroup stylesContainer="profile-input-container">
                {({ hidePassword, togglePasswordVisibility }) => (
                  <Fragment>
                    <InputGroup.LeftIcon
                      icon={faLock}
                      styles={inputStyles["fa-lock-middle"]}
                    />
                    <InputGroup.Label value={Constants.NewPassword} />
                    <InputGroup.Input
                      isLoading={isFetching}
                      attributes={{
                        name: "newPassword",
                        placeholder: Constants.NewPasswordPlaceholder,
                        autoComplete: "new-password",
                        type: hidePassword === true ? "password" : "text",
                      }}
                      readonlyFocusEnabled
                      preventCopyPasteEnabled
                    />
                    <InputGroup.RightIcon
                      icon={hidePassword === true ? faEye : faEyeSlash}
                      styles={inputStyles["fa-eye-middle"]}
                      handleClick={togglePasswordVisibility}
                    />
                  </Fragment>
                )}
              </InputGroup>
            </EditItem>
          </Fragment>
        )}
        <EditItem>
          <section className={styles["edit-item"]}>
            <button id={styles["save-button"]} type="submit" disabled={isMutating}>
              <span id={styles["save-button-text"]}>
                {isMutating ? Constants.Saving : Constants.Save}
              </span>
            </button>
          </section>
        </EditItem>
      </form>
    </div>
  );
}
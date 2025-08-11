import { Fragment, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
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
import { queryClient } from "../../../../config";
import { GlobalConstants } from "../../../../utils";
import { InputGroup, Textarea } from "../../../../components";
import { inputStyles } from "../../../../styles";
import { Errors } from "../../errors";
import { Constants } from "../../constants";
import { useImageChange } from "../../hooks";
import { ProfileEditItem as EditItem, UserPhoto } from "../../components";
import { editUserData, userDetailsQuery } from "../../api";
import { isEditFormValid as isFormValid } from "../../helpers";
import styles from "./styles.module.scss";

export function ProfileEdit() {
  const navigate = useNavigate();
  const { data: userInfo } = useQuery(userDetailsQuery);
  const mutation = useMutation(editUserData, {
    onSuccess: () => {
      queryClient.invalidateQueries(userDetailsQuery.queryKey);
      toast.success(Constants.ProfileUpdatedSuccess);
      navigate("/profile");
    },
    onError: (error: unknown) => {
      toast.error(typeof error === "string" ? error : Errors.GenericError);
    },
  });
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [image, handleImageChange] = useImageChange(userInfo?.image);

  function triggerImageChange() {
    inputFileRef?.current?.click();
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    if (isFormValid(formData) === false) return;

    const file = inputFileRef.current?.files?.[0];
    if (file !== undefined) {
      formData.set("file", file);
    }

    const userData: IRequest = {
      username: formData.get("username") as string,
      biography: formData.get("biography") as string,
      phone: formData.get("phone") as string,
      currentPassword: (formData.get("currentPassword") as string) || "",
      newPassword: (formData.get("newPassword") as string) || "",
      file,
    };
    

    mutation.mutate(userData);
  }

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
        <EditItem>
          <InputGroup stylesContainer="profile-input-container">
            <Fragment>
              <InputGroup.LeftIcon
                icon={faUser}
                styles={inputStyles["fa-lock-middle"]}
              />
              <InputGroup.Label value={Constants.Name} />
              <InputGroup.Input
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
            <button id={styles["save-button"]} type="submit" disabled={mutation.isLoading}>
              <span id={styles["save-button-text"]}>
                {mutation.isLoading ? Constants.Saving : Constants.Save}
              </span>
            </button>
          </section>
        </EditItem>
      </form>
    </div>
  );
}

interface IRequest {
  username: string;
  biography: string;
  phone: string;
  currentPassword: string;
  newPassword: string;
  file?: File;
}

import { Fragment, useRef } from "react";
import { ActionFunctionArgs, NavLink, redirect, useFetcher } from "react-router-dom";
import toast from "react-hot-toast";
import { QueryClient, useQuery } from "@tanstack/react-query";
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
import { ProfileEditItem as EditItem, UserPhoto } from "../../components";
import { Constants } from "../../constants";
import { useImageChange } from "../../hooks";
import { editUserData, userDetailsQuery } from "../../api";
import { isEditFormValid as isFormValid } from "../../helpers";
import styles from "./styles.module.scss";

function ProfileEdit() {
  const fetcher = useFetcher();
  const inputFileRef = useRef<HTMLInputElement>(null);
  const { data: userInfo } = useQuery(userDetailsQuery);
  const [image, handleImageChange] = useImageChange(userInfo?.image);

  function triggerImageChange() {
    inputFileRef?.current?.click();
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    if (isFormValid(formData) === false) {
      return;
    }

    const file = inputFileRef.current?.files?.[0];
    if (file !== undefined) {
      formData.set("file", file);
    }
    fetcher.submit(formData, {
      method: "post",
      action: "",
    });
  }

  return (
    <div className={styles["page-container"]}>
      <NavLink className={styles["back-button"]} to="/profile" end replace>
        <span className={styles["arrow-left"]} />
        <span>{Constants.Back}</span>
      </NavLink>
      <fetcher.Form
        className={styles.form}
        autoComplete="off"
        method="post"
        action=""
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
            <button id={styles["save-button"]} type="submit">
              <span id={styles["save-button-text"]}>{Constants.Save}</span>
            </button>
          </section>
        </EditItem>
      </fetcher.Form>
    </div>
  );
}

export { ProfileEdit as default, createEditProfileAction };

function createEditProfileAction(queryClient: QueryClient) {
  return async function ({ request }: ActionFunctionArgs) {
    try {
      const formData = await request.formData();
      const file = formData.get("file");

      const updatedFormData = new FormData();
      updatedFormData.append("file", file as File);

      for (const [key, value] of formData.entries()) {
        if (key !== "file") {
          updatedFormData.append(key, value);
        }
      }

      const userData: IRequest = Object.fromEntries(
        updatedFormData.entries()
      ) as unknown as IRequest;

      if (userData.currentPassword == null && userData.newPassword == null) {
        userData.currentPassword = "";
        userData.newPassword = "";
      }

      await editUserData(userData);
      await queryClient.refetchQueries(userDetailsQuery.queryKey);
      return redirect(`${import.meta.env.VITE_CLIENT_URI}profile`);
    } catch (error) {
      console.error(error);
      toast.error(error as string);
      return undefined;
    }
  };
}

interface IRequest {
  username: string;
  biography: string;
  phone: string;
  currentPassword: string;
  newPassword: string;
  file?: File;
}

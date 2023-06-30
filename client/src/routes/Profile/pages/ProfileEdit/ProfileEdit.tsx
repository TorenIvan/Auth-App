import { ChangeEvent, Fragment, useRef, useState } from "react";
import { Form, NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import {
  faCamera,
  faEnvelope,
  faLock,
  faPhone,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Textarea } from "../../../../components";
import {
  ProfileInput,
  ProfileEditItem as EditItem,
  UserPhoto,
} from "../../components";
import { Constants } from "../../constants";
import { TUserInfo } from "../../types";
import { editUserData, userDetailsQuery } from "../../api";
import { isEditFormValid as isFormValid } from "../../helpers";
import styles from "./styles.module.scss";
import { inputStyles } from "../../../../styles";

function ProfileEdit() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const inputFileRef = useRef<HTMLInputElement>(null);
  const userInfo: TUserInfo = queryClient.getQueryData(
    userDetailsQuery().queryKey
  );
  const [image, setImage] = useState<string | null>(findPhoto(userInfo?.image));

  function onFileChange(event: ChangeEvent<HTMLInputElement>) {
    event.stopPropagation();

    const files = event.currentTarget.files;
    if (files === null || files === undefined || files.length === 0) {
      return;
    }
    const imageUrl = URL.createObjectURL(files[0]);
    setImage(imageUrl);
  }

  function handleImage(_: unknown) {
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

    try {
      const updated = await action(queryClient, formData)();
      if (updated === false) {
        return;
      }
      navigate("../");
    } catch (error) {
      console.error(error);
      return;
    }
  }

  return (
    <div className={styles["page-container"]}>
      <NavLink className={styles["back-button"]} to="/profile" end replace>
        <span className={styles["arrow-left"]} />
        <span>{Constants.Back}</span>
      </NavLink>
      <Form
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
          handleImage={handleImage}
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
                onChange={onFileChange}
              />
            </>
          }
          paragraphSlot={
            <span id={styles["default-photo-text"]} onClick={handleImage}>
              {image === null
                ? Constants.AddPhoto.toUpperCase()
                : Constants.ChangePhoto.toUpperCase()}
            </span>
          }
        />
        <EditItem>
          <ProfileInput
            label={Constants.Name}
            attributes={{
              name: "username",
              placeholder: Constants.NamePlaceholder,
              defaultValue: userInfo?.username,
            }}
            leftIconSlot={
              <FontAwesomeIcon
                icon={faUser}
                className={inputStyles["fa-lock-middle"]}
              />
            }
          />
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
          <ProfileInput
            label={Constants.Phone}
            attributes={{
              name: "phone",
              placeholder: Constants.PhonePlaceholder,
              defaultValue: userInfo?.phone,
            }}
            leftIconSlot={
              <FontAwesomeIcon
                icon={faPhone}
                className={inputStyles["fa-lock-middle"]}
              />
            }
          />
        </EditItem>
        <EditItem>
          <ProfileInput
            label={Constants.Email}
            attributes={{
              placeholder: Constants.EmailPlaceholder,
              defaultValue: userInfo?.email,
              disabled: true,
            }}
            leftIconSlot={
              <FontAwesomeIcon
                icon={faEnvelope}
                className={inputStyles["fa-lock-middle"]}
              />
            }
          />
        </EditItem>
        {userInfo?.signInMethod === "credentials" && (
          <Fragment>
            <EditItem>
              <ProfileInput
                label={Constants.CurrentPassword}
                attributes={{
                  name: "currentPassword",
                  placeholder: Constants.CurrentPasswordPlaceholder,
                  autoComplete: "new-password",
                }}
                isPassword
              />
            </EditItem>
            <EditItem>
              <ProfileInput
                label={Constants.NewPassword}
                attributes={{
                  name: "newPassword",
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
            <button id={styles["save-button"]} type="submit">
              <span id={styles["save-button-text"]}>{Constants.Save}</span>
            </button>
          </section>
        </EditItem>
      </Form>
    </div>
  );
}

export { ProfileEdit as default, action };

function action(queryClient: QueryClient, formData: FormData) {
  return async function () {
    try {
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

      await editUserData(userData);

      await queryClient.refetchQueries(userDetailsQuery().queryKey);
      return true;
    } catch (error) {
      toast.error(error as string);
      return false;
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

function findPhoto(image?: string) {
  if (image === undefined) {
    return null;
  }
  return image;
}

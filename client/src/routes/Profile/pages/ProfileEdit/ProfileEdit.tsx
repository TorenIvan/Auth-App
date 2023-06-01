import { ChangeEvent, Fragment, useRef, useState } from "react";
import { Form, NavLink, redirect, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
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
import styles from "./styles.module.scss";

function ProfileEdit() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [image, setImage] = useState<string | null>(null);
  const inputFileRef = useRef<HTMLInputElement>(null);

  const { queryKey } = userDetailsQuery();
  const userInfo: TUserInfo = queryClient.getQueryData(queryKey);

  function onFileChange(event: ChangeEvent<HTMLInputElement>) {
    event.stopPropagation();

    const files = event.currentTarget.files;
    if (files === null || files === undefined || files.length === 0) {
      return;
    }
    console.log(files[0]);
    const imageUrl = URL.createObjectURL(files[0]);
    setImage(imageUrl);
  }

  function handleImage(_: unknown) {
    inputFileRef?.current?.click();
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const file = inputFileRef.current?.files?.[0];

    if (file !== undefined) {
      formData.set("file", file);
    }

    try {
      const updated = await action(queryClient, formData)();
      console.log("updated: ", updated);
      if (updated === false) {
        return;
      }
      navigate("../");
    } catch (error) {
      console.error(error);
      return;
      // Handle error
    }
  };

  return (
    <div className={styles["page-container"]}>
      <NavLink className={styles["back-button"]} to="/profile" replace>
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
      console.log("file inside action: ", file);
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

      console.log("userData: ", userData);

      console.dir(userData);

      await editUserData(userData);

      console.log("Perasa edo");
      await queryClient.refetchQueries(userDetailsQuery().queryKey);
      console.log("Perasa kai edo");
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

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

function ProfileEdit() {
  const queryClient = useQueryClient();
  const { queryKey } = userDetailsQuery();
  const userInfo: TUserInfo = queryClient.getQueryData(queryKey);

  return (
    <div className={styles["page-container"]}>
      <NavLink className={styles["back-button"]} to="/profile" replace>
        <span className={styles["arrow-left"]} />
        <span>Back</span>
      </NavLink>
      <Form className={styles.form} autoComplete="off">
        <article>
          <h3>Change Info</h3>
          <span>Changes will be reflected to every service</span>
        </article>
        <EditItem>
          <section className={styles["edit-photo-item"]}>
            <section id={styles["image-container"]}>
              <FontAwesomeIcon
                icon={faCamera}
                color="#ffffff"
                className={styles["edit-photo-icon"]}
              />
              <span id={styles["mobile-photo-text"]}>ADD PHOTO</span>
            </section>
            <span id={styles["default-photo-text"]}>ADD PHOTO</span>
          </section>
        </EditItem>
        <EditItem>
          <Input
            label="Name"
            attributes={{
              placeholder: "Enter your name...",
              defaultValue: userInfo?.username,
            }}
          />
        </EditItem>
        <EditItem>
          <Textarea
            labelSlot={<label>Bio</label>}
            attributes={{
              placeholder: "Enter your bio...",
              defaultValue: userInfo?.biography,
            }}
          />
        </EditItem>
        <EditItem>
          <Input
            label="Phone"
            attributes={{
              placeholder: "Enter your phone...",
              defaultValue: userInfo?.phone,
            }}
          />
        </EditItem>
        <EditItem>
          <Input
            label="Email"
            attributes={{
              placeholder: "Enter your email...",
              defaultValue: userInfo?.email,
            }}
          />
        </EditItem>
        <EditItem>
          <Input
            label="Current Password"
            attributes={{
              placeholder: "Enter your current password...",
              autoComplete: "new-password",
            }}
            isPassword
          />
        </EditItem>
        <EditItem>
          <Input
            label="New Password"
            attributes={{
              placeholder: "Enter your new password...",
              autoComplete: "new-password",
            }}
            isPassword
          />
        </EditItem>
        <EditItem>
          <section className={styles["edit-item"]}>
            <div id={styles["save-button"]}>
              <span id={styles["save-button-text"]}>Save</span>
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

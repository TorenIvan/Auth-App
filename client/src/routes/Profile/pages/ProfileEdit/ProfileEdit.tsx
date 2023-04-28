import { NavLink } from "react-router-dom";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./styles.module.scss";
import { Textarea } from "../../../../components";
import { ProfileInput as Input } from "../../components";

function ProfileEdit() {
  return (
    <div className={styles["page-container"]}>
      <NavLink className={styles["back-button"]} to="/profile" replace>
        <span className={styles["arrow-left"]} />
        <span>Back</span>
      </NavLink>
      <fieldset>
        <article>
          <h3>Change Info</h3>
          <span>Changes will be reflected to every service</span>
        </article>
        <section className={styles["edit-item-container"]}>
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
        </section>
        <section className={styles["edit-item-container"]}>
          <Input
            label="Name"
            attributes={{ placeholder: "Enter your name..." }}
          />
        </section>
        <section className={styles["edit-item-container"]}>
          <Textarea
            labelSlot={<label>Bio</label>}
            attributes={{ placeholder: "Enter your bio..." }}
          />
        </section>
        <section className={styles["edit-item-container"]}>
          <Input
            label="Phone"
            attributes={{ placeholder: "Enter your phone..." }}
          />
        </section>
        <section className={styles["edit-item-container"]}>
          <Input
            label="Email"
            attributes={{ placeholder: "Enter your email..." }}
          />
        </section>
        <section className={styles["edit-item-container"]}>
          <Input
            label="Current Password"
            attributes={{ placeholder: "Enter your current password..." }}
          />
        </section>
        <section className={styles["edit-item-container"]}>
          <Input
            label="New Password"
            attributes={{ placeholder: "Enter your new password..." }}
          />
        </section>
        <section className={styles["edit-item-container"]}>
          <section className={styles["edit-item"]}>
            <div id={styles["save-button"]}>
              <span id={styles["save-button-text"]}>Save</span>
            </div>
          </section>
        </section>
      </fieldset>
    </div>
  );
}

export default ProfileEdit;

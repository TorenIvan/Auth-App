import { NavLink } from "react-router-dom";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./styles.module.scss";

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
          <section className={styles["edit-item"]}>
            <label>Name</label>
            <input placeholder="Enter your name..."></input>
          </section>
        </section>
        <section className={styles["edit-item-container"]}>
          <section className={styles["edit-item"]}>
            <label>Bio</label>
            <textarea placeholder="Enter your bio..."></textarea>
          </section>
        </section>
        <section className={styles["edit-item-container"]}>
          <section className={styles["edit-item"]}>
            <label>Phone</label>
            <input placeholder="Enter your phone..."></input>
          </section>
        </section>
        <section className={styles["edit-item-container"]}>
          <section className={styles["edit-item"]}>
            <label>Email</label>
            <input placeholder="Enter your email..."></input>
          </section>
        </section>
        <section className={styles["edit-item-container"]}>
          <section className={styles["edit-item"]}>
            <label>Current Password</label>
            <input placeholder="Enter your current password..."></input>
          </section>
        </section>
        <section className={styles["edit-item-container"]}>
          <section className={styles["edit-item"]}>
            <label>New Password</label>
            <input placeholder="Enter your new password..."></input>
          </section>
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

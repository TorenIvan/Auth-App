import styles from "./styles.module.scss";

function ProfileEdit() {
  return (
    <div className={styles["page-container"]}>
      <div className={styles["back-button"]}>
        <span className={styles["arrow-left"]} />
        <span>Back</span>
      </div>
      <fieldset>
        <article>
          <h3>Change Info</h3>
          <span>Changes will be reflected to every service</span>
        </article>
        {/* <section className={styles["edit-item-container"]}>
          <section className={styles["edit-item"]}>
            <figure>
              <img alt="User Photo with Edit Option" />
              <figcaption>CHANGE PHOTO</figcaption>
            </figure>
          </section>
        </section> */}
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
      </fieldset>
    </div>
  );
}

export default ProfileEdit;

import styles from "./styles.module.scss";

function ProfileDetails() {
  return (
    <div className={styles["page-container"]}>
      <article id={styles.header}>
        <h2 id={styles["header-title"]}>Personal Info</h2>
        <span id={styles["header-subtext"]}>
          Basic info, like your name and photo
        </span>
      </article>
      <main className={styles["details-container"]}>
        <section className={styles["details-first-row"]}>
          <div>
            <span>Profile</span>
            <span>Some info may be visible</span>
          </div>
          <button>Edit</button>
        </section>
        <section className={styles["details-row"]}>
          <div className={styles["details-label-column"]}>
            <span>PHOTO</span>
          </div>
          <div className={styles["details-value-column"]}>
            <div>PICTURE</div>
          </div>
        </section>
        <section className={styles["details-row"]}>
          <div className={styles["details-label-column"]}>
            <span>NAME</span>
          </div>
          <div className={styles["details-value-column"]}>
            <span>Vaggelisshmos</span>
          </div>
        </section>
        <section className={styles["details-row"]}>
          <div className={styles["details-label-column"]}>
            <span>BIO</span>
          </div>
          <div className={styles["details-value-column"]}>
            <span>Some BIO</span>
          </div>
        </section>
        <section className={styles["details-row"]}>
          <div className={styles["details-label-column"]}>
            <span>PHONE</span>
          </div>
          <div className={styles["details-value-column"]}>
            <span>+306912855623</span>
          </div>
        </section>
        <section className={styles["details-row"]}>
          <div className={styles["details-label-column"]}>
            <span>EMAIL</span>
          </div>
          <div className={styles["details-value-column"]}>
            <span>Vaggelisshmos@gmail.com</span>
          </div>
        </section>
        <section className={styles["details-row"]}>
          <div className={styles["details-label-column"]}>
            <span>PASSWORD</span>
          </div>
          <div className={styles["details-value-column"]}>
            <span>***********</span>
          </div>
        </section>
      </main>
    </div>
  );
}

export default ProfileDetails;

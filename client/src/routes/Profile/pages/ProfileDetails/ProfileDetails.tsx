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
          <div className={styles["details-first-row-label-column"]}>
            <h3>Profile</h3>
            <span>Some info may be visible</span>
          </div>
          <div className={styles["details-first-row-value-column"]}>
            <span>Edit</span>
          </div>
        </section>
        <section className={styles["details-row"]}>
          <div className={styles["details-label-column"]}>
            <span>PHOTO</span>
          </div>
          <div className={styles["details-value-column"]}>
            <span>PICTURE</span>
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
            <span>
              Some BIO kai kati akoma pou i8ela dhudgfvods; hcuyh gt omos? ti
              sou ekdjoihj;o
            </span>
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

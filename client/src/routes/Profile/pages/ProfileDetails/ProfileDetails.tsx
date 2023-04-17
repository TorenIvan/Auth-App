import { NavLink } from "react-router-dom";
import { ProfileDetail } from "../../components";
import { Constants } from "../../constants";
import styles from "./styles.module.scss";

function ProfileDetails() {
  return (
    <div className={styles["page-container"]}>
      <article id={styles.header}>
        <h2 id={styles["header-title"]}>{Constants.ProfileInfo}</h2>
        <span id={styles["header-subtext"]}>
          {Constants.ProfileInfoSubText}
        </span>
      </article>
      <main className={styles["details-container"]}>
        <section className={styles["details-first-row"]}>
          <div className={styles["details-first-row-label-column"]}>
            <h3>{Constants.ProfileHeaderTitle}</h3>
            <span>{Constants.ProfileHeaderSubText}</span>
          </div>
          <NavLink
            className={styles["details-first-row-value-column"]}
            to="/profile/edit"
            replace
          >
            <span>{Constants.Edit}</span>
          </NavLink>
        </section>
        <ProfileDetail
          label={Constants.Photo.toUpperCase()}
          valueSlot={<span>PICTURE</span>}
        />
        <ProfileDetail
          label={Constants.Name.toUpperCase()}
          valueSlot={<span>Vaggelisshmos</span>}
        />
        <ProfileDetail
          label={Constants.Bio.toUpperCase()}
          valueSlot={
            <span>
              Some BIO kai kati akoma pou i8ela dhudgfvods; hcuyh gt omos? ti
              sou ekdjoihj;o
            </span>
          }
        />
        <ProfileDetail
          label={Constants.Phone.toUpperCase()}
          valueSlot={<span>+306912855623</span>}
        />
        <ProfileDetail
          label={Constants.Email.toUpperCase()}
          valueSlot={<span>Vaggelisshmos@gmail.com</span>}
        />
        <ProfileDetail
          label={Constants.Password.toUpperCase()}
          valueSlot={<span>{Constants.Asterisks}</span>}
        />
      </main>
    </div>
  );
}

export default ProfileDetails;

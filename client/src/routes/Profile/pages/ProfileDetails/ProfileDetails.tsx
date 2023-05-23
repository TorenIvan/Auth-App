import { useQueryClient } from "@tanstack/react-query";
import { NavLink } from "react-router-dom";
import { userDetailsQuery } from "../../api";
import { ProfileDetail, UserPhoto } from "../../components";
import { Constants } from "../../constants";
import { TUserInfo } from "../../types";
import styles from "./styles.module.scss";

const notAddedSlot: JSX.Element = <em>Not added...</em>;

function ProfileDetails(): JSX.Element | null {
  const queryClient = useQueryClient();
  const { queryKey } = userDetailsQuery();
  const userInfo: TUserInfo = queryClient.getQueryData(queryKey);

  if (userInfo === undefined) return null;
  const photoSlot: JSX.Element = findPhotoSlot(userInfo?.image);
  const imageExists: boolean = !!userInfo?.image;
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
          isImage={imageExists}
          valueSlot={photoSlot}
        />
        <ProfileDetail
          label={Constants.Name.toUpperCase()}
          valueSlot={<span>{userInfo!.username}</span>}
        />
        <ProfileDetail
          label={Constants.Bio.toUpperCase()}
          valueSlot={<span>{userInfo?.biography || notAddedSlot}</span>}
        />
        <ProfileDetail
          label={Constants.Phone.toUpperCase()}
          valueSlot={<span>{userInfo?.phone || notAddedSlot}</span>}
        />
        <ProfileDetail
          label={Constants.Email.toUpperCase()}
          valueSlot={<span>{userInfo!.email}</span>}
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

function findPhotoSlot(image?: string) {
  let photoSlot: JSX.Element = <span>{notAddedSlot}</span>;
  if (image !== undefined && image?.trim() !== "") {
    photoSlot = (
      <UserPhoto image="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80" />
    );
  }
  return photoSlot;
}

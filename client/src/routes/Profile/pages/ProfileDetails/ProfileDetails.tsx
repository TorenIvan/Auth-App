import { NavLink } from "react-router-dom";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { userDetailsQuery } from "../../api";
import { ProfileDetail, UserPhoto } from "../../components";
import { Constants } from "../../constants";
import styles from "./styles.module.scss";
import { useEffect } from "react";
import { Errors } from "../../errors";

const notAddedSlot: JSX.Element = <em>{Constants.NotAdded}</em>;

function ProfileDetails(): JSX.Element | undefined {
  const { data: userInfo, isLoading, isError } = useQuery(userDetailsQuery);
  useEffect(() => {
    if (isError) {
      toast.error(Errors.GenericError);
    }
  }, [isError])

  if (isLoading || userInfo === undefined) return undefined;
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
            end
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
  if (image !== undefined) {
    photoSlot = <UserPhoto image={image} />;
  }
  return photoSlot;
}

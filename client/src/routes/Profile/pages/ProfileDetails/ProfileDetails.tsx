import { NavLink } from "react-router-dom";
import { Constants } from "../../constants";
import { ProfileDetail, UserPhoto } from "../../components";
import { useRetrieveUserDataQuery } from "../../hooks";
import styles from "./styles.module.scss";

const notAddedSlot: JSX.Element = <em>{Constants.NotAdded}</em>;

export function ProfileDetails(): JSX.Element | undefined {
  const { userInfo, isFetching } = useRetrieveUserDataQuery();

  if (isFetching === false && userInfo === undefined) return undefined;

  const photoSlot: JSX.Element = findPhotoSlot(isFetching, userInfo?.image);
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
          valueSlot={isFetching 
            ? <div className="text-skeleton wide"></div> 
            : <span>{userInfo?.username}</span>}
        />
        <ProfileDetail
          label={Constants.Bio.toUpperCase()}
          valueSlot={isFetching 
            ? <div className="text-skeleton wide"></div> 
            : <span>{userInfo?.biography || notAddedSlot}</span>}
        />
        <ProfileDetail
          label={Constants.Phone.toUpperCase()}
          valueSlot={isFetching 
            ? <div className="text-skeleton wide"></div> 
            : <span>{userInfo?.phone || notAddedSlot}</span>}
        />
        <ProfileDetail
          label={Constants.Email.toUpperCase()}
          valueSlot={isFetching 
            ? <div className="text-skeleton wide"></div> 
            : <span>{userInfo!.email || notAddedSlot}</span>}
        />
        <ProfileDetail
          label={Constants.Password.toUpperCase()}
          valueSlot={isFetching 
            ? <div className="text-skeleton wide"></div> 
            : <span>{Constants.Asterisks}</span>}
        />
      </main>
    </div>
  );
}

function findPhotoSlot(isLoading: boolean, image?: string ) {
  if (isLoading) {
   return (
    <div className={`avatar-skeleton large`} />
   ) 
  }
  return image ? <UserPhoto image={image} /> : <em>{Constants.NotAdded}</em>;
}


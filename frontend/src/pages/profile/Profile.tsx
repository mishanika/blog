import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Profile.scss";
import ProfilePopup from "../../components/profilePopup/ProfilePopup";
import { url } from "../../utils/utils";
import ProfileAvatarPopup from "../../components/profileAvatarPopup/ProfileAvatarPopup";
import Avatar from "../../components/avatar/Avatar";

export type ProfileInfo = {
  photo: string;
  username: string;
  name: string;
  status: string;
  description: string;
  myUsername: string;
};

export type Popup = {
  avatarPopup: boolean;
  editPopup: boolean;
};

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { username } = useParams();
  const [profileInfo, setProfileInfo] = useState<ProfileInfo>({
    photo: "",
    username: "",
    name: "",
    status: "",
    description: "",
    myUsername: "",
  });
  const [popupIsOpen, setPopupIsOpen] = useState<Popup>({ avatarPopup: false, editPopup: false });
  const [isFetching, setIsFetching] = useState<boolean>(false);

  useEffect(() => {
    setIsFetching(true);
    setPopupIsOpen({ avatarPopup: false, editPopup: false });
  }, [username]);

  useEffect(() => {
    if (isFetching) {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        navigate("/login");
        return;
      }
      fetch(`${url}/user/profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify({ username: username, token: token }),
      })
        .then((data) => data.json())
        .then((data: ProfileInfo) => {
          localStorage.setItem("username", data.myUsername);
          setProfileInfo(data);
          setIsFetching(false);
        });
    }
  }, [username, isFetching]);

  return (
    <>
      {popupIsOpen.editPopup && profileInfo && (
        <ProfilePopup {...profileInfo} setPopupIsOpen={setPopupIsOpen} setProfileInfo={setProfileInfo} />
      )}
      {popupIsOpen.avatarPopup && profileInfo && profileInfo.photo.length ? (
        <ProfileAvatarPopup photo={profileInfo.photo} username={profileInfo.username} setPopupIsOpen={setPopupIsOpen} />
      ) : null}

      <div className="profile-wrapper">
        <div className="photo-info-wrapper">
          <div className="photo" onClick={() => setPopupIsOpen((prev) => ({ ...prev, avatarPopup: true }))}>
            <Avatar photo={profileInfo.photo} username={profileInfo.username} className={"profile-photo"} />
          </div>
          <div className="info">
            <div className="username">{profileInfo.username}</div>
            <div className="name">{profileInfo.name}</div>
            <div className="status">{profileInfo.status}</div>
            <div className="description">{profileInfo.description}</div>
          </div>
          {username === localStorage.getItem("username") ? (
            <div className="edit" onClick={() => setPopupIsOpen((prev) => ({ ...prev, editPopup: true }))}>
              Edit
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default Profile;

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Profile.scss";
import ProfilePopup from "../../components/profilePopup/ProfilePopup";

export type ProfileInfo = {
  photo: string;
  username: string;
  name: string;
  status: string;
  description: string;
  myUsername: string;
};

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { username } = useParams();
  const [profileInfo, setProfileInfo] = useState<ProfileInfo>();
  const [popupIsOpen, setPopupIsOpen] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  useEffect(() => {
    setIsFetching(true);
  }, [username]);

  useEffect(() => {
    if (isFetching) {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        navigate("/login");
        return;
      }
      fetch("http://localhost:3030/user/profile", {
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
      {popupIsOpen && profileInfo ? (
        <ProfilePopup {...profileInfo} setPopupIsOpen={setPopupIsOpen} setProfileInfo={setProfileInfo} />
      ) : (
        false
      )}
      <div className="profile-wrapper">
        <div className="photo-info-wrapper">
          <div className="photo">
            <img src={`http://localhost:3030/${profileInfo?.photo}`} alt="" />
          </div>
          <div className="info">
            <div className="username">{profileInfo?.username}</div>
            <div className="name">{profileInfo?.name}</div>
            <div className="status">{profileInfo?.status}</div>
            <div className="description">{profileInfo?.description}</div>
          </div>
          {username === localStorage.getItem("username") ? (
            <div className="edit" onClick={() => setPopupIsOpen(true)}>
              Edit
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default Profile;

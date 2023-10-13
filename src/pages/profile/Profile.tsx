import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { auth } from "../../utils/utils";
//import jwt from "jsonwebtoken";
import "./Profile.scss";
import ProfilePopup from "../../components/popup/ProfilePopup";

export type ProfileInfo = {
  photo: string;
  username: string;
  name: string;
  status: string;
  description: string;
  myUsername: string;
};

type Payload = {
  id: number;
  username: string;
  exp: number;
};

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { username } = useParams();
  const [profileInfo, setProfileInfo] = useState<ProfileInfo>();
  const [popupIsOpen, setPopupIsOpen] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  //const [isfirstFullfield, setIsFirstFullfield] = useState<boolean>(false);

  // const decodeToken = () => {
  //   const token = localStorage.getItem("accessToken");
  //   if (token !== null) {
  //     const { username } = jwt.decode(token) as Payload;
  //     return username;
  //   }
  // };

  useEffect(() => {
    setIsFetching(true);
  }, []);

  // useEffect(() => {
  //   if (ifFetching) {
  //     console.log("useEffect");

  //     auth(navigate);

  //     setIsFetching(false);
  //     setIsFirstFullfield(true);
  //   }
  // }, [ifFetching]);

  useEffect(() => {
    if (isFetching) {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        navigate("/login");
        return;
      }
      fetch("http://localhost:3030/profile", {
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
  }, [isFetching]);

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

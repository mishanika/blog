import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Profile.scss";
import ProfilePopup from "../../components/profilePopup/ProfilePopup";
import { url } from "../../utils/utils";
import ProfileAvatarPopup from "../../components/profileAvatarPopup/ProfileAvatarPopup";
import Avatar from "../../components/avatar/Avatar";
import { PostType } from "../blog/Blog";
import Post from "../../components/post/Post";

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
  const [isFetching, setIsFetching] = useState({ profile: false, posts: false });
  const [postType, setPostType] = useState({ created: true, liked: false });
  const [createdPosts, setCreatedPosts] = useState<PostType[]>([]);
  const [likedPosts, setLikedPosts] = useState<PostType[]>([]);
  const [parts, setParts] = useState({ created: 1, liked: 1 });
  const [isPartGot, setIsPartGot] = useState({ created: false, liked: false });
  const [innitialFetch, setInnitialFetch] = useState(true);

  useEffect(() => {
    setIsFetching((prev) => ({ ...prev, profile: true }));
    setPopupIsOpen({ avatarPopup: false, editPopup: false });
  }, [username]);

  useEffect(() => {
    if (isFetching.profile) {
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
          setIsFetching((prev) => ({ posts: true, profile: false }));
        });
    }
  }, [username, isFetching]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login");
      return;
    }
    if (isFetching.posts) {
      if (innitialFetch) {
        fetch(`${url}/user/posts/created/${token}/${parts.created}`)
          .then((data) => data.json())
          .then((data) => setCreatedPosts(data.posts))
          .then(() => setInnitialFetch(false))
          .then(() => setIsPartGot((prev) => ({ ...prev, created: true })))
          .then(() => setIsFetching((prev) => ({ ...prev, posts: false })));
      } else if ((postType.created && !isPartGot.created) || (postType.liked && !isPartGot.liked)) {
        fetch(
          `${url}/user/posts/${postType.created ? "created" : "liked"}/${token}/${
            postType.created ? parts.created : parts.liked
          }`
        )
          .then((data) => data.json())
          .then((data) =>
            postType.created
              ? setCreatedPosts((prev) => [...prev, ...data.posts])
              : setLikedPosts((prev) => [...prev, ...data.posts])
          )
          .then(() => {
            if (postType.created) {
              setIsPartGot((prev) => ({ ...prev, created: true }));
            } else {
              setIsPartGot((prev) => ({ ...prev, liked: true }));
            }
          })
          .then(() => setIsFetching((prev) => ({ ...prev, posts: false })));
      }
    }
  }, [isFetching]);

  useEffect(() => {
    if (postType.created) {
      setIsPartGot((prev) => ({ ...prev, created: false }));
    } else {
      setIsPartGot((prev) => ({ ...prev, liked: false }));
    }
    setIsFetching((prev) => ({ ...prev, posts: true }));
  }, [parts]);

  const handleParts = () => {
    if (postType.created) {
      setParts((prev) => ({ ...prev, created: prev.created + 1 }));
    } else {
      setParts((prev) => ({ ...prev, liked: prev.liked + 1 }));
    }
  };

  const handlePostType = (type: string) => {
    if (type === "created") {
      setPostType({ created: true, liked: false });
    } else {
      setPostType({ created: false, liked: true });
    }
    setIsFetching((prev) => ({ ...prev, posts: true }));
  };

  const postRender = (item: PostType) => <Post {...item} />;

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
        <div className="liked-created-wrapper">
          <div className="labels">
            <div className={`created ${postType.created ? "active" : ""}`} onClick={() => handlePostType("created")}>
              Created posts
            </div>
            <div className={`liked ${postType.liked ? "active" : ""}`} onClick={() => handlePostType("liked")}>
              Liked posts
            </div>
          </div>
          <div className="posts">{postType.created ? createdPosts.map(postRender) : likedPosts.map(postRender)}</div>
          <div className="get-next-part" onClick={() => handleParts()}>
            Get next posts
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;

import "./ProfileAvatarPopup.scss";
import { Popup } from "../../pages/profile/Profile";
import { useRef } from "react";
import Avatar from "../avatar/Avatar";

type PopupProps = {
  photo: string;
  username: string;
  setPopupIsOpen: React.Dispatch<React.SetStateAction<Popup>>;
};

const ProfileAvatarPopup: React.FC<PopupProps> = ({ photo, username, setPopupIsOpen }) => {
  const popupRef = useRef<HTMLDivElement>(null);
  const close = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.target === popupRef.current) {
      setPopupIsOpen((prev) => ({ ...prev, avatarPopup: false }));
    }
  };

  return (
    <div className="avatar-popup-wrapper popup" onClick={(e) => close(e)} ref={popupRef}>
      <Avatar photo={photo} username={username} className={"profile-photo"} />
    </div>
  );
};

export default ProfileAvatarPopup;

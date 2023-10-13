import { useRef } from "react";
import "./ProfilePopup.scss";
import { ProfileInfo } from "../../pages/profile/Profile";

type PopupProps = {
  photo: string;
  username: string;
  name: string;
  status: string;
  description: string;
  setPopupIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setProfileInfo: React.Dispatch<React.SetStateAction<ProfileInfo | undefined>>;
};

const ProfilePopup: React.FC<PopupProps> = ({
  username,
  name,
  status,
  description,
  setPopupIsOpen,
  setProfileInfo,
}) => {
  const popupRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const photoRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const statusRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLInputElement>(null);

  const close = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.target === popupRef.current) {
      setPopupIsOpen(false);
    }
  };

  const edit = () => {
    const data = {
      photo: photoRef.current?.files,
      username: usernameRef.current?.value,
      name: nameRef.current?.value,
      status: statusRef.current?.value,
      description: descriptionRef.current?.value,
      oldUsername: username,
    };
    if (formRef.current) {
      //accessToken
      const form = new FormData();

      for (const [key, value] of Object.entries(data)) {
        if (value) {
          if (typeof value === "string") {
            form.append(key, value);

            continue;
          }
          form.append(key, value[0]);
        }
      }
      console.log(formRef.current);

      fetch("http://localhost:3030/edit", {
        method: "POST",

        body: form,
      })
        .then((data) => data.json())
        .then((data) => {
          localStorage.setItem("username", data.username);
          setProfileInfo(data);
        });
    }
  };

  return (
    <div className="popup-wrapper" onClick={(e) => close(e)} ref={popupRef}>
      <form className="info" ref={formRef}>
        <div className="photo-wrapper">
          <span>Click to choose a photo or drag and drop it</span>
          <input type="file" ref={photoRef} />
        </div>
        <div className="text-wrapper">
          Username:
          <input type="text" placeholder={username} ref={usernameRef} />
        </div>
        <div className="text-wrapper">
          Name:
          <input type="text" placeholder={name} ref={nameRef} />
        </div>{" "}
        <div className="text-wrapper">
          Status:
          <input type="text" placeholder={status} ref={statusRef} />
        </div>{" "}
        <div className="text-wrapper">
          Description:
          <input type="text" placeholder={description} ref={descriptionRef} />
        </div>
        <div className="edit" onClick={() => edit()}>
          Edit
        </div>
      </form>
    </div>
  );
};

export default ProfilePopup;

import { useRef } from "react";
import "./ProfilePopup.scss";
import { Popup, ProfileInfo } from "../../pages/profile/Profile";
import { url } from "../../utils/utils";
import { v4 as uuid } from "uuid";
import { ref, uploadBytes } from "firebase/storage";
import { bucket } from "../firebase/firebase";

type PopupProps = {
  photo: string;
  username: string;
  name: string;
  status: string;
  description: string;
  setPopupIsOpen: React.Dispatch<React.SetStateAction<Popup>>;
  setProfileInfo: React.Dispatch<React.SetStateAction<ProfileInfo>>;
};

const ProfilePopup: React.FC<PopupProps> = ({
  username,
  name,
  status,
  photo,
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
      setPopupIsOpen((prev) => ({ ...prev, editPopup: false }));
    }
  };

  const edit = async () => {
    if (photoRef.current?.files) {
      // const form = new FormData();

      // for (const [key, value] of Object.entries(data)) {
      //   if (value) {
      //     if (typeof value === "string") {
      //       form.append(key, value);

      //       continue;
      //     }
      //     form.append(key, value[0]);
      //   }
      // }
      // console.log(formRef.current);

      const name = `${uuid()}.${photoRef.current?.files[0].type.split("/")[1]}`;
      const firebaseRef = ref(bucket, `userPhoto/${name}`);
      const metadata = {
        contentType: photoRef.current.files[0].type,
      };
      console.log(name);

      const isLoaded = await uploadBytes(firebaseRef, photoRef.current?.files[0], metadata);

      if (!isLoaded) {
        return;
      }
      const data = {
        photo: name ? name : "",
        username: usernameRef.current?.value ? usernameRef.current?.value : username,
        name: nameRef.current?.value ? nameRef.current?.value : "",
        status: statusRef.current?.value ? statusRef.current?.value : "",
        description: descriptionRef.current?.value ? descriptionRef.current?.value : "",
        oldUsername: username,
        accessToken: localStorage.getItem("accessToken"),
      };

      fetch(`${url}/user/edit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify(data),
      })
        .then((data) => data.json())
        .then((data) => {
          localStorage.setItem("username", data.username);
          setProfileInfo(data);
        });
    }
  };

  return (
    <div className="popup-wrapper popup" onClick={(e) => close(e)} ref={popupRef}>
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

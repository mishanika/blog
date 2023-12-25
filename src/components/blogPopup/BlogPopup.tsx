import { useRef } from "react";
import "./BlogPopup.scss";
import { PostType } from "../../pages/blog/Blog";
import { useNavigate } from "react-router-dom";

type BlogPopupProps = {
  setIsPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setPosts: React.Dispatch<React.SetStateAction<PostType[]>>;
};

const BlogPopup: React.FC<BlogPopupProps> = ({ setIsPopupOpen, setPosts }) => {
  const navigate = useNavigate();
  const popupRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLInputElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const textRef = useRef<HTMLInputElement>(null);

  const close = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.target === popupRef.current) {
      setIsPopupOpen(false);
    }
  };
  const createPost = () => {
    const data = {
      photo: photoRef.current?.files,
      title: titleRef.current?.value ? titleRef.current?.value : "",
      text: textRef.current?.value ? titleRef.current?.value : "",
      accessToken: localStorage.getItem("accessToken"),
    };
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

    fetch("https://blog-api-3pat.onrender.com/post/create", {
      method: "POST",

      body: form,
    })
      .then((data) => data.json())
      .then((data) => {
        data.auth ? localStorage.setItem("accessToken", data.accessToken) : navigate("/login");
        if (!data.auth) {
          localStorage.removeItem("username");
        }
        setPosts((prev) => [...prev, data.post]);
      });
  };

  return (
    <div className="popup-wrapper" onClick={(e) => close(e)} ref={popupRef}>
      <form className="info">
        <div className="photo-wrapper">
          <span>Click to choose a photo or drag and drop it</span>
          <input type="file" ref={photoRef} />
        </div>
        <div className="text-wrapper">
          Title:
          <input type="text" ref={titleRef} />
        </div>
        <div className="text-wrapper">
          Text:
          <input type="text" ref={textRef} />
        </div>{" "}
        <div className="edit" onClick={() => createPost()}>
          Create
        </div>
      </form>
    </div>
  );
};

export default BlogPopup;

import { useRef, useState } from "react";
import CreatePostMenu from "../../components/createPostMenu/CreatePostMenu";
import "./CreatePost.scss";
import { useNavigate } from "react-router-dom";
import { renderCreate, url } from "../../utils/utils";
import TagsPopup from "../../components/TagsPopup/TagsPopup";
import { bucket } from "../../components/firebase/firebase";
import { v4 as uuid } from "uuid";
import { ref, uploadBytes } from "firebase/storage";

export type PostElement = {
  element: string;
  value: string;
};

const CreatePost = () => {
  const navigate = useNavigate();
  const postRef = useRef<HTMLDivElement>(null);
  const [elements, setElements] = useState<PostElement[]>([]);
  const [title, setTitle] = useState("Your Title supposed to be here");
  const [active, setActive] = useState(-1);
  const [isTagsOpen, setIsTagsOpen] = useState(false);
  const [tags, setTags] = useState<string[]>([]);

  const setActivehandler = (index: number) => {
    setActive(index);
  };

  const createPost = async () => {
    const elemsCopy = [...elements];
    const imgs = elemsCopy.filter((item) => item.element === "img");

    for (let img of imgs) {
      const type = img.value.split(";base64,")[0].split(":")[1];
      const metadata = {
        contentType: type,
      };
      const name = `${uuid()}.${type.split("/")[1]}`;
      const photoRef = ref(bucket, `postPhoto/${name}`);
      const blob = await fetch(img.value).then((res) => res.blob());

      await uploadBytes(photoRef, blob, metadata);
      img.value = name;
    }

    const data = {
      title: title,
      elements: [...elemsCopy],
      accessToken: localStorage.getItem("accessToken"),
      date: Date.now(),
      tags: [...tags],
    };

    fetch(`${url}/post/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(data),
    })
      .then((data) => data.json())
      .then((data) => {
        localStorage.setItem("accessToken", data.accessToken);
        navigate(`/post/${data.postId}`);
      })
      .catch(() => {
        navigate("/login");
      });
  };

  // useEffect(() => {
  //   const citiesCol = collection(db, "users");

  //   getDocs(citiesCol)
  //     .then((citySnapshot) => citySnapshot.docs.map((doc) => doc.data()))
  //     .then(console.log);
  // }, []);

  const renderElementsCreate = renderCreate(active, elements, setActivehandler, setElements);

  return (
    <>
      {isTagsOpen ? <TagsPopup setPopupIsOpen={setIsTagsOpen} setTags={setTags} tags={tags} /> : null}
      <div className="create-post-wrapper" ref={postRef}>
        <div className="create-post">
          <CreatePostMenu setElements={setElements} />
          <div className="post-proto">
            <input type="text" className="title" value={title} onChange={(e) => setTitle(e.target.value)} />
            {elements.map(renderElementsCreate)}
          </div>
          <div className="btns">
            <div className="create-post-btn" onClick={() => createPost()}>
              <div className="block-to-move"></div>
              <span>Create post</span>
            </div>
            <div className="add-tags-btn" onClick={() => setIsTagsOpen(true)}>
              Add Tags
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreatePost;

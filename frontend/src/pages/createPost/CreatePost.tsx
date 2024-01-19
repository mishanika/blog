import { useRef, useState } from "react";
import CreatePostMenu from "../../components/createPostMenu/CreatePostMenu";
import "./CreatePost.scss";
import { useNavigate } from "react-router-dom";
import { renderCreate, url } from "../../utils/utils";
import TagsPopup from "../../components/TagsPopup/TagsPopup";

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

  const createPost = () => {
    const data = {
      title: title,
      elements: [...elements],
      accessToken: localStorage.getItem("accessToken"),
      date: Date.now(),
      tags: [...tags],
    };
    //     const form = new FormData();

    //     for (const [key, value] of Object.entries(data)) {
    //  form.append()
    // }
    //     fetch(`http://localhost:3030/post/create`, {
    //       method: "POST",

    //       body: data),
    //     })
    //       .then((data) => data.json())
    //       .then((data) => {
    //         localStorage.setItem("accessToken", data.accessToken);
    //         navigate(`/post/${data.postId}`);
    //       })
    //       .catch(() => {
    //         navigate("/login");
    //       });
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

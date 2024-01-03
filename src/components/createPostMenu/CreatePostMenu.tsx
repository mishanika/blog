import { PostElement } from "../../pages/createPost/CreatePost";
import "./CreatePostMenu.scss";
import { text } from "./text";

type MenuProps = {
  setElements: React.Dispatch<React.SetStateAction<PostElement[]>>;
};

const CreatePostMenu: React.FC<MenuProps> = ({ setElements }) => {
  const createElement = (element: string) => {
    setElements((prev) => [...prev, { element: element, value: "Title" }]);
  };

  const btnsRender = (item: string) => (
    <div className="btn" key={item} onClick={() => createElement(item)}>
      {item}
    </div>
  );

  return (
    <div className="create-post-menu">
      <div className="btns">{text.map(btnsRender)}</div>
    </div>
  );
};

export default CreatePostMenu;

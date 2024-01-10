import { NavigateFunction } from "react-router-dom";
import { PostElement } from "../pages/createPost/CreatePost";
import H1C from "../components/postCreateParts/h1/H1";
import H2C from "../components/postCreateParts/h2/H2";
import H3C from "../components/postCreateParts/h3/H3";
import TextC from "../components/postCreateParts/text/Text";
import ImageC from "../components/postCreateParts/img/Image";
import H1 from "../components/postParts/h1/H1";
import Text from "../components/postParts/text/Text";
import H3 from "../components/postParts/h3/H3";
import H2 from "../components/postParts/h2/H2";
import Image from "../components/postParts/img/Image";

export const url = "https://blog-back-delta.vercel.app";

export const auth = async (navigate: NavigateFunction) => {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    navigate("/login");
    return;
  }

  fetch(`${url}/user/auth`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify({ accessToken: accessToken }),
  })
    .then((data) => data.json())
    .then((data) => (data.auth ? localStorage.setItem("accessToken", data.accessToken) : navigate("/login")));
};

export const renderCreate = (
  active: number,
  elements: PostElement[],
  setActivehandler: (index: number) => void,
  setElements: React.Dispatch<React.SetStateAction<PostElement[]>>
) => {
  return ({ element, value }: PostElement, index: number) => {
    switch (element) {
      case "h1":
        return (
          <H1C
            value={value}
            isActive={index === active ? true : false}
            index={index}
            elements={elements}
            onClick={() => setActivehandler(index)}
            setElements={setElements}
          />
        );
      case "h2":
        return (
          <H2C
            value={value}
            isActive={index === active ? true : false}
            index={index}
            elements={elements}
            onClick={() => setActivehandler(index)}
            setElements={setElements}
          />
        );
      case "h3":
        return (
          <H3C
            value={value}
            isActive={index === active ? true : false}
            index={index}
            elements={elements}
            onClick={() => setActivehandler(index)}
            setElements={setElements}
          />
        );
      case "text":
        return (
          <TextC
            value={value}
            isActive={index === active ? true : false}
            index={index}
            elements={elements}
            onClick={() => setActivehandler(index)}
            setElements={setElements}
          />
        );
      case "img":
        return (
          <ImageC
            value={value}
            isActive={index === active ? true : false}
            index={index}
            elements={elements}
            onClick={() => setActivehandler(index)}
            setElements={setElements}
          />
        );
    }
  };
};

export const renderPost = ({ element, value }: PostElement) => {
  switch (element) {
    case "h1":
      return <H1 value={value} />;
    case "h2":
      return <H2 value={value} />;
    case "h3":
      return <H3 value={value} />;
    case "text":
      return <Text value={value} />;
    case "img":
      return <Image value={value} />;
  }
};

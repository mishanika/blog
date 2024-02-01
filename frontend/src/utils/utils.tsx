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
import { DataReg } from "../pages/register/Register";
import { DataLog } from "../pages/login/Login";

export const url = "https://blog-back-delta.vercel.app";
//export const url = "http://localhost:3030";

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

function isAnDataReg(obj: any): obj is DataReg {
  return "username" in obj && "password" in obj && "repeatedPassword" in obj;
}

export const handleClick = (
  e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  data: DataReg | DataLog,
  inputRefs: React.MutableRefObject<(HTMLInputElement | null)[]>,
  labelRefs: React.MutableRefObject<(HTMLLabelElement | null)[]>
) => {
  if (e.target instanceof HTMLLabelElement) {
    return;
  }

  const target = e.target as HTMLInputElement;

  let counter = 0;
  for (const key in data) {
    if (target && target === inputRefs.current[counter]) {
      labelRefs.current[counter]!.classList.add("active");
    } else {
      data[key as keyof (DataReg | DataLog)].length
        ? labelRefs.current[counter]!.classList.add("active")
        : labelRefs.current[counter]!.classList.remove("active");
    }

    counter++;
  }
};

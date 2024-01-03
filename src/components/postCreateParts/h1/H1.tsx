import { PropsWithChildren, useEffect, useState } from "react";
import "./H1.scss";
import { Props } from "../types";

const H1: React.FC<PropsWithChildren & Props> = ({ value, isActive, index, elements, onClick, setElements }) => {
  const [innerValue, setInnerValue] = useState(value);
  //const [timer, setTimer] = useState<ReturnType<typeof setTimeout>>();
  //const textRef = useRef<HTMLHeadingElement>(null);

  const handleElement = () => {
    console.log("hello");
    // elements[index].value = textRef.current?.textContent ? textRef.current?.textContent : "";
    elements[index].value = innerValue;
    console.log(elements[index]);
    setElements((prev) => [...prev]);
  };

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;

    console.log("change");
    if (target.value !== null) {
      setInnerValue(target.value);
    }
  };

  // const debounce = (func: () => void, timeoutMs: number) => {
  //   //   let timer: ReturnType<typeof setTimeout>;
  //   return function () {
  //     clearTimeout(timer);

  //     setTimer(setTimeout(() => func(), timeoutMs));
  //   };
  // };

  // const handleWithDebounce = debounce(handleElement, 1000);

  // useEffect(() => {
  //   handleWithDebounce();
  // }, [innerValue]);

  useEffect(() => {
    handleElement();
  }, [innerValue]);

  return isActive ? (
    <input
      type="text"
      className="text-change h1"
      onChange={(e) => handleChange(e)}
      autoFocus={isActive}
      value={innerValue}
    />
  ) : (
    <h1 className="text-settings" onClick={onClick}>
      {value}
    </h1>
  );
};

export default H1;

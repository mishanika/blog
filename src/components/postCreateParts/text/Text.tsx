import { PropsWithChildren, useEffect, useRef, useState } from "react";
import "./Text.scss";
import { Props } from "../types";

const Text: React.FC<PropsWithChildren & Props> = ({ value, isActive, index, elements, onClick, setElements }) => {
  const [innerValue, setInnerValue] = useState(value);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleElement = () => {
    elements[index].value = innerValue;
    console.log(elements[index]);
    setElements((prev) => [...prev]);
  };

  const handleChange = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    target.style.height = "auto";
    target.style.height = `${target.scrollHeight}px`;

    if (target.value !== null) {
      setInnerValue(target.value);
    }
  };

  useEffect(() => {
    handleElement();
  }, [innerValue]);

  useEffect(() => {
    if (isActive && textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [isActive]);

  return isActive ? (
    <textarea
      className="text-change text"
      onChange={(e) => handleChange(e)}
      autoFocus={isActive}
      value={innerValue}
      ref={textareaRef}
    />
  ) : (
    <span className="text-settings span-block" onClick={onClick}>
      {value.split("\n").map((item) => (
        <p>{item}</p>
      ))}
    </span>
  );
};

export default Text;

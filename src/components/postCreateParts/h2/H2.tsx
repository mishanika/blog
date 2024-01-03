import { PropsWithChildren, useEffect, useRef, useState } from "react";
import "./H2.scss";
import { Props } from "../types";

const H2: React.FC<PropsWithChildren & Props> = ({ value, isActive, index, elements, onClick, setElements }) => {
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
      className="text-change h2"
      onChange={(e) => handleChange(e)}
      autoFocus={isActive}
      value={innerValue}
      ref={textareaRef}
    />
  ) : (
    <h2 className="text-settings" onClick={onClick}>
      {value.split("\n").map((item) => (
        <p>{item}</p>
      ))}
    </h2>
  );
};

export default H2;

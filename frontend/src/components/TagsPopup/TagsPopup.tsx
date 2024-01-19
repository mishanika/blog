import "./TagsPopup.scss";
import { useEffect, useRef } from "react";

type PopupProps = {
  tags: string[];
  setPopupIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
};

const TagsPopup: React.FC<PopupProps> = ({ tags, setPopupIsOpen, setTags }) => {
  const popupRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const close = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.target === popupRef.current) {
      setPopupIsOpen(false);
    }
  };

  const deleteTag = (id: number) => {
    setTags((prev) => {
      prev.splice(id, 1);
      return [...prev];
    });
  };

  const renderTags = (item: string, id: number) => (
    <span className="tag" onClick={() => deleteTag(id)}>
      {item},{" "}
    </span>
  );

  useEffect(() => {
    const popup = popupRef.current;

    const listener = (e: KeyboardEvent) => {
      if (e.code === "Enter") {
        if (inputRef.current) {
          const value = inputRef.current.value;

          setTags((prev) => {
            const elem = prev.find((tag) => tag === value);

            return !elem && value.length ? [...prev, value.replaceAll(" ", "")] : [...prev];
          });
        }
      }
    };

    popup?.addEventListener("keydown", listener);

    return () => {
      popup?.removeEventListener("keydown", listener);
    };
  }, []);

  return (
    <div className="tags-popup-wrapper popup" onClick={(e) => close(e)} ref={popupRef}>
      <div className="add-tags-form">
        <span className="notation">Click on tag to delete it</span>
        Your tags: {tags.map(renderTags)} <input type="text" ref={inputRef} />
      </div>
    </div>
  );
};

export default TagsPopup;

import React, { useEffect, useRef, useState } from "react";
import "./SearchBar.scss";
import { url } from "../../utils/utils";
import { PostType } from "../../pages/blog/Blog";

type SearchProps = {
  setPosts: React.Dispatch<React.SetStateAction<PostType[]>>;
};

const SearchBar: React.FC<SearchProps> = ({ setPosts }) => {
  const [searchText, setSearchText] = useState("");
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const debounce = (func: () => void, timeoutMs: number) => {
    let timer = timerRef;
    return function (...args: []) {
      if (timer.current) {
        clearTimeout(timer.current);
      }

      timer.current = setTimeout(() => func(...args), timeoutMs);
    };
  };

  const search = () => {
    if (searchText.length) {
      const data = {
        searchText: searchText,
      };

      fetch(`${url}/post/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify(data),
      })
        .then((data) => data.json())
        .then((data) => setPosts(data.posts));
    } else {
      fetch(`${url}/post`)
        .then((data) => data.json())
        .then((data) => setPosts(data.posts));
    }
  };
  const searchWithDebounce = debounce(search, 2000);

  //   const inputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {

  //   };
  useEffect(() => {
    searchWithDebounce();
  }, [searchText]);

  return (
    <input
      type="text"
      placeholder="Search by post name"
      className="search"
      onChange={(e) => setSearchText(e.target.value)}
    />
  );
};

export default SearchBar;

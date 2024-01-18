import { useState } from "react";
import "./SearchBar.scss";

const SearchBar = () => {
  const [searchText, setSearchTex] = useState("");

  return (
    <input
      type="text"
      placeholder="Search by post name"
      className="search"
      onChange={(e) => setSearchTex(e.target.value)}
    />
  );
};

export default SearchBar;

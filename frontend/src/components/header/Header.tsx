import { Link, useNavigate } from "react-router-dom";
import "./Header.scss";

const Header = () => {
  const username = localStorage.getItem("username");
  const navigate = useNavigate();

  const signOut = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("accessToken");
    navigate("/login");
  };

  return (
    <header className="header">
      <Link to="/">Blog</Link>
      <Link to={!username ? "/" : `/profile/${username}`}>Profile</Link>

      {username && username.length ? (
        <div className="sign-out" onClick={() => signOut()}>
          Sign out
        </div>
      ) : (
        false
      )}
    </header>
  );
};

export default Header;

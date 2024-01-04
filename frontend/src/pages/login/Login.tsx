import { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.scss";

type Data = {
  username: string;
  password: string;
};

const Login: React.FC = () => {
  const navigate = useNavigate();

  const labelUsernameRef = useRef<HTMLLabelElement>(null);

  const [data, setData] = useState<Data>({
    username: "",
    password: "",
  });

  const login = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const dataToPost = {
      username: data.username,
      password: data.password,
    };

    const response = await fetch("http://localhost:3030/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(dataToPost),
    });

    if (!response.ok) {
      labelUsernameRef.current!.textContent = "Wrong login or password";
      labelUsernameRef.current!.style.color = "Red";
      return;
    }
    const { accessToken } = await response.json();

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("username", data.username);
    navigate("/");
  };

  return (
    <div className="wrapper">
      <form className="login-form" onSubmit={(e) => login(e)}>
        <div className="title">Login</div>
        <div className="input-wrapper">
          <label htmlFor="username" className="username-label" ref={labelUsernameRef}>
            Username
          </label>
          <div>
            <input
              type="text"
              className="username"
              id="username"
              onChange={(e) => setData((prev) => ({ ...prev, username: e.target.value }))}
            />
          </div>
        </div>
        <div className="input-wrapper">
          <label htmlFor="password" className="password-label">
            Password
          </label>
          <div>
            <input
              type="password"
              className="password"
              id="password"
              onChange={(e) => setData((prev) => ({ ...prev, password: e.target.value }))}
            />
          </div>
        </div>

        <input type="submit" value="Log in" className="submit" />
        <div className="text">
          Don't have an account yet?{" "}
          <Link to="/register" className="redirect">
            Register
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;

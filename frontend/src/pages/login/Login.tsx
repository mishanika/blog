import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.scss";
import { handleClick, url } from "../../utils/utils";

export type DataLog = {
  username: string;
  password: string;
};

const Login: React.FC = () => {
  const navigate = useNavigate();

  // const labelUsernameRef = useRef<HTMLLabelElement>(null);

  const labelRefs = useRef<Array<HTMLLabelElement | null>>([]);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const [data, setData] = useState<DataLog>({
    username: "",
    password: "",
  });

  const login = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const dataToPost = {
      username: data.username,
      password: data.password,
    };

    const response = await fetch(`${url}/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(dataToPost),
    });

    if (!response.ok) {
      labelRefs.current[0]!.textContent = "Wrong login or password";
      labelRefs.current[0]!.style.color = "Red";
      return;
    }
    const { accessToken } = await response.json();

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("username", data.username);
    navigate("/");
  };

  return (
    <div className="wrapper" onClick={(e) => handleClick(e, data, inputRefs, labelRefs)}>
      <form className="login-form" onSubmit={(e) => login(e)}>
        <div className="title">Login</div>
        <div className="input-wrapper">
          <label htmlFor="username" className="username-label" ref={(el) => (labelRefs.current[0] = el)}>
            Username
          </label>
          <div>
            <input
              type="text"
              className="username"
              id="username"
              onChange={(e) => setData((prev) => ({ ...prev, username: e.target.value }))}
              ref={(el) => (inputRefs.current[0] = el)}
            />
          </div>
        </div>
        <div className="input-wrapper">
          <label htmlFor="password" className="password-label" ref={(el) => (labelRefs.current[1] = el)}>
            Password
          </label>
          <div>
            <input
              type="password"
              className="password"
              id="password"
              onChange={(e) => setData((prev) => ({ ...prev, password: e.target.value }))}
              ref={(el) => (inputRefs.current[1] = el)}
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

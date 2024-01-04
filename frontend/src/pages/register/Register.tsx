import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.scss";
import Eye from "../../assets/svg/Eye";
import { url } from "../../utils/utils";

type Data = {
  username: string;
  password: string;
  repeatedPassword: string;
};

const Register: React.FC = () => {
  const navigate = useNavigate();
  const passRef = useRef<HTMLInputElement>(null);
  const repeatedPassRef = useRef<HTMLInputElement>(null);

  const labelUsernameRef = useRef<HTMLLabelElement>(null);
  const labelPassRef = useRef<HTMLLabelElement>(null);
  const labelRepeatedPassRef = useRef<HTMLLabelElement>(null);

  const [data, setData] = useState<Data>({
    username: "",
    password: "",
    repeatedPassword: "",
  });
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const showPassword = (
    setIsPasswordShown: React.Dispatch<React.SetStateAction<boolean>>,
    ref: React.RefObject<HTMLInputElement>
  ) => {
    if (ref.current) {
      if (ref.current.type === "password") {
        ref.current.type = "text";
      } else {
        ref.current.type = "password";
      }
    }
    setIsPasswordShown((prev) => !prev);
  };

  const register = async () => {
    let errorFlag = false;
    if (data.password.length < 5) {
      labelPassRef.current!.textContent = "Password must contain more than 5 characters";
      labelPassRef.current!.style.color = "Red";
      errorFlag = true;
    }
    if (data.password !== data.repeatedPassword) {
      labelRepeatedPassRef.current!.textContent = "Passwords doesn't match";
      labelRepeatedPassRef.current!.style.color = "Red";
      errorFlag = true;
    }
    if (errorFlag) {
      return;
    }

    const dataToPost = {
      username: data.username,
      password: data.password,
      repeatedPassword: data.repeatedPassword,
    };

    const response = await fetch(`${url}/user/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(dataToPost),
    });

    if (!response.ok) {
      labelUsernameRef.current!.textContent = "There is a user with such username";
      labelUsernameRef.current!.style.color = "Red";
      return;
    }
    navigate("/login");
  };

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsFetching(true);
  };

  useEffect(() => {
    if (isFetching) {
      register().then(() => setIsFetching(false));
    }
  }, [isFetching]);

  return (
    <div className="wrapper">
      <form className="register-form" onSubmit={(e) => submitHandler(e)}>
        <div className="title">Register</div>
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
          <label htmlFor="password" className="password-label" ref={labelPassRef}>
            Password
          </label>
          <div>
            <input
              type="password"
              className="password"
              id="password"
              onChange={(e) => setData((prev) => ({ ...prev, password: e.target.value }))}
              ref={passRef}
            />
            <Eye showPassword={showPassword} passRef={passRef} />
          </div>
        </div>
        <div className="input-wrapper">
          <label htmlFor="repeat-password" className="repeat-password-label" ref={labelRepeatedPassRef}>
            Repeat password
          </label>
          <div>
            <input
              type="password"
              className="repeat-password"
              id="repeat-password"
              onChange={(e) => setData((prev) => ({ ...prev, repeatedPassword: e.target.value }))}
              ref={repeatedPassRef}
            />
            <Eye showPassword={showPassword} passRef={repeatedPassRef} />
          </div>
        </div>
        <input type="submit" value="Register" className="submit" />
        <div className="text">
          Have an account?{" "}
          <Link to="/login" className="redirect">
            Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Register;

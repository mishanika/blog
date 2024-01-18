import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.scss";
import Eye from "../../assets/svg/Eye";
import { handleClick, url } from "../../utils/utils";

export type DataReg = {
  username: string;
  password: string;
  repeatedPassword: string;
};

const Register: React.FC = () => {
  const navigate = useNavigate();
  const passRef = useRef<HTMLInputElement>(null);
  const repeatedPassRef = useRef<HTMLInputElement>(null);

  // const labelUsernameRef = useRef<HTMLLabelElement>(null);
  // const labelPassRef = useRef<HTMLLabelElement>(null);
  // const labelRepeatedPassRef = useRef<HTMLLabelElement>(null);

  const labelRefs = useRef<Array<HTMLLabelElement | null>>([]);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const [data, setData] = useState<DataReg>({
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
      labelRefs.current[1]!.textContent = "Password must contain more than 5 characters";
      labelRefs.current[1]!.style.color = "Red";
      errorFlag = true;
    }
    if (data.password !== data.repeatedPassword) {
      labelRefs.current[2]!.textContent = "Passwords doesn't match";
      labelRefs.current[2]!.style.color = "Red";
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
      labelRefs.current[0]!.textContent = "There is a user with such username";
      labelRefs.current[0]!.style.color = "Red";
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
    <div className="wrapper" onClick={(e) => handleClick(e, data, inputRefs, labelRefs)}>
      <form className="register-form" onSubmit={(e) => submitHandler(e)}>
        <div className="title">Register</div>
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
            <Eye showPassword={showPassword} passRef={passRef} />
          </div>
        </div>
        <div className="input-wrapper">
          <label htmlFor="repeat-password" className="repeat-password-label" ref={(el) => (labelRefs.current[2] = el)}>
            Repeat password
          </label>
          <div>
            <input
              type="password"
              className="repeat-password"
              id="repeat-password"
              onChange={(e) => setData((prev) => ({ ...prev, repeatedPassword: e.target.value }))}
              ref={(el) => (inputRefs.current[2] = el)}
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

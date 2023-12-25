import { NavigateFunction } from "react-router-dom";

export const auth = async (navigate: NavigateFunction) => {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    navigate("/login");
    return;
  }

  fetch("https://blog-api-3pat.onrender.com/user/auth", {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify({ accessToken: accessToken }),
  })
    .then((data) => data.json())
    .then((data) => (data.auth ? localStorage.setItem("accessToken", data.accessToken) : navigate("/login")));
};

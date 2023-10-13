import Blog from "../../pages/blog/Blog";
import Login from "../../pages/login/Login";
import Profile from "../../pages/profile/Profile";
import Register from "../../pages/register/Register";

export type IRoute = {
  path: string;
  element: JSX.Element;
};

export const routes: IRoute[] = [
  {
    path: "/",
    element: <Blog />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
];

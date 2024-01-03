import Blog from "../../pages/blog/Blog";
import Login from "../../pages/login/Login";
import Profile from "../../pages/profile/Profile";
import Register from "../../pages/register/Register";
import CreatePost from "../../pages/createPost/CreatePost";
import PostPage from "../../pages/post/PostPage";

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
    path: "/profile/:username",
    element: <Profile />,
  },
  {
    path: "/createPost",
    element: <CreatePost />,
  },
  {
    path: "/post/:id",
    element: <PostPage />,
  },
];

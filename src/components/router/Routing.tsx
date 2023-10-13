import { Routes, Route } from "react-router-dom";
import { IRoute, routes } from "./routes";

const Routing = () => {
  const renderRoute = ({ path, element }: IRoute) =>
    path === "/profile" ? (
      <Route path={`${path}/:username`} element={element} key={path} />
    ) : (
      <Route path={path} element={element} key={path} />
    );

  return <Routes>{routes.map(renderRoute)}</Routes>;
};

export default Routing;

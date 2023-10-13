import "./Layout.scss";
import Routing from "../router/Routing";
import Header from "../header/Header";

const Layout = () => {
  return (
    <>
      <Header />
      <Routing />
    </>
  );
};

export default Layout;

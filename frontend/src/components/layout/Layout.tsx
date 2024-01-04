import "./Layout.scss";
import Routing from "../router/Routing";
import Header from "../header/Header";

const Layout = () => {
  return (
    <>
      <div className="background"></div>
      <Header />
      <Routing />
    </>
  );
};

export default Layout;

import "./Blog.scss";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../utils/utils";

const Blog = () => {
  const navigate = useNavigate();

  useEffect(() => {
    auth(navigate);
  }, []);

  return <div className="blog-wrapper"></div>;
};

export default Blog;

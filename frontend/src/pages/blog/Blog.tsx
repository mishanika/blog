import "./Blog.scss";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, url } from "../../utils/utils";
import Post from "../../components/post/Post";
import BlogPopup from "../../components/blogPopup/BlogPopup";
import { BlogContext } from "../../utils/context";
import SearchBar from "../../components/searchBar/SearchBar";

export type PostType = {
  id: number;
  title: string;
  image: string | undefined;
  text: string;
  publisherPhoto: string;
  publisherUsername: string;
  comments: CommentType[];
};
export type CommentType = {
  id: number;
  publisherPhoto: string;
  publisherUsername: string;
  text: string;
  replies: CommentType[];
};

const Blog = () => {
  const navigate = useNavigate();
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [posts, setPosts] = useState<PostType[]>([]);

  useEffect(() => {
    setIsFetching(true);
  }, []);

  useEffect(() => {
    if (isFetching) {
      auth(navigate)
        .then(() => fetch(`${url}/post`))
        .then((data) => data.json())
        .then((data) => {
          setIsFetching(false);
          setPosts([...data.posts]);
        });
    }
  }, [isFetching]);

  const postRender = (item: PostType) => <Post {...item} />;

  return (
    <>
      {isPopupOpen ? <BlogPopup setIsPopupOpen={setIsPopupOpen} setPosts={setPosts} /> : false}
      <div className="blog-wrapper">
        <div className="posts-wrapper">
          {/* {<div className="create" onClick={() => setIsPopupOpen(true)}>
            Create new
          </div>} */}
          <div className="functions">
            <SearchBar />

            <Link to={`/createPost`} className="create">
              {" "}
              Create new
            </Link>
          </div>
          <BlogContext.Provider value={{ setPosts: setPosts, posts: posts }}>
            <div className="posts">{posts?.map(postRender)}</div>
          </BlogContext.Provider>
        </div>
      </div>
    </>
  );
};

export default Blog;

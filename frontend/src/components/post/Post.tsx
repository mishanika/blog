import "./Post.scss";
import { PostType as PostProps } from "../../pages/blog/Blog";
import { Link } from "react-router-dom";
import Avatar from "../avatar/Avatar";

const Post: React.FC<PostProps> = ({ id, title, publisherPhoto, publisherUsername, tags }) => {
  const tagsRender = (item: string) => <div className="tag">{item}</div>;

  return (
    <div className="post">
      <div className="post-top">
        <Link to={`/post/${id}`}>
          <div className="title">
            <div className="tooltip">{title}</div>
            {title}
          </div>
        </Link>
        <Link to={`/profile/${publisherUsername}`} className="publisher-wrapper">
          <div className="publisher-name">{publisherUsername}</div>
          <div className="publisher-photo">
            <Avatar photo={publisherPhoto} username={publisherUsername} className={"post-img"} />
          </div>
        </Link>
      </div>
      {tags.length ? <div className="tags">{tags?.map(tagsRender)}</div> : null}
    </div>
  );
};

export default Post;

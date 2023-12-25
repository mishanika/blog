import "./Post.scss";
import { useState } from "react";
import { CommentType, PostType as PostProps } from "../../pages/blog/Blog";
import Comment from "../comment/Comment";
import { Link } from "react-router-dom";
import CommentCreate from "../commentWrite/CommentCreate";
import { PostContext } from "../../utils/context";

const Post: React.FC<PostProps> = ({ id, title, image, text, publisherPhoto, publisherUsername, comments }) => {
  const [isCommentsOpen, setIsCommentsOpen] = useState<boolean>(false);
  const [isCommentCreateOpen, setIsCommentCreateOpen] = useState<boolean>(false);

  const commentsRender = (item: CommentType) => <Comment {...item} />;

  return (
    <div className="post">
      <div className="post-top">
        <div className="title">{title}</div>
        <Link to={`/profile/${publisherUsername}`} className="publisher-wrapper">
          <div className="publisher-name">{publisherUsername}</div>
          <div className="publisher-photo">
            <img src={`${publisherPhoto}`} alt="post" className="post-img" />
          </div>
        </Link>
      </div>
      <div className="image">
        <img src={`${image}`} alt="post" className="post-img" />
      </div>
      <div className="text">{text}</div>
      <PostContext.Provider value={{ postId: id }}>
        <div className="comments-wrapper">
          <span
            className="close-open-comments"
            onClick={() => {
              setIsCommentsOpen((prev) => !prev);
              setIsCommentCreateOpen(false);
            }}
          >
            {!isCommentsOpen ? "Open" : "Close"} comments
          </span>
          {!isCommentsOpen ? (
            false
          ) : (
            <div className="create" onClick={() => setIsCommentCreateOpen((prev) => !prev)}>
              Comment
            </div>
          )}
          {isCommentCreateOpen ? <CommentCreate comments={comments} commentReplyId={null} /> : false}
          {!isCommentsOpen ? false : comments.map(commentsRender)}
        </div>
      </PostContext.Provider>
    </div>
  );
};

export default Post;

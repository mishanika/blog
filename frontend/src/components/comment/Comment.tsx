import "./Comment.scss";
import { useContext, useState } from "react";
import { CommentType as CommentProps } from "../../pages/blog/Blog";
import CommentCreate from "../commentWrite/CommentCreate";
import { PostContext } from "../../utils/context";

const Comment: React.FC<CommentProps> = ({ id, publisherPhoto, publisherUsername, text, replies }) => {
  const [isRepliesOpen, setIsRepliesOpen] = useState<boolean>(false);
  const postContext = useContext(PostContext);
  //const [isCommentCreateOpen, setIsCommentCreateOpen] = useState<boolean>(false);

  const commentsRender = (item: CommentProps) => <Comment {...item} />;

  return (
    <div className="comment">
      <div className="publisher-wrapper">
        <div className="publisher-photo">
          {publisherPhoto.length ? (
            <img src={`${publisherPhoto}`} alt="comment-photo" className="comment-img" />
          ) : (
            false
          )}
        </div>
        <div className="publisher-name">{publisherUsername}</div>
      </div>
      <div className="comment-text">{text}</div>
      <div
        className="reply"
        onClick={() => postContext && postContext.setIsCommentCreateOpen({ id: id, isOpen: true })}
      >
        Reply
      </div>
      {postContext && postContext.isCommentCreateOpen.isOpen && postContext.isCommentCreateOpen.id === id ? (
        <CommentCreate comments={replies} commentReplyId={id} />
      ) : (
        false
      )}
      <div className="replies">
        {replies.length > 0 ? (
          <span className="close-open-replies" onClick={() => setIsRepliesOpen((prev) => !prev)}>
            {!isRepliesOpen ? "Open" : "Close"} replies
          </span>
        ) : (
          false
        )}
        {isRepliesOpen && replies.length > 0 && <>{replies.map(commentsRender)}</>}
      </div>
    </div>
  );
};

export default Comment;

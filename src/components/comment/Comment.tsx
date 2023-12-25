import "./Comment.scss";
import { useState } from "react";
import { CommentType as CommentProps } from "../../pages/blog/Blog";
import CommentCreate from "../commentWrite/CommentCreate";

const Comment: React.FC<CommentProps> = ({ id, publisherPhoto, publisherUsername, text, replies }) => {
  const [isRepliesOpen, setIsRepliesOpen] = useState<boolean>(false);
  const [isCommentCreateOpen, setIsCommentCreateOpen] = useState<boolean>(false);

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
      <div className="reply" onClick={() => setIsCommentCreateOpen((prev) => !prev)}>
        Reply
      </div>
      {isCommentCreateOpen ? <CommentCreate comments={replies} commentReplyId={id} /> : false}
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

import "./CommentCreate.scss";
import { useContext, useRef } from "react";
import { CommentType as CommentProps } from "../../pages/blog/Blog";
import { BlogContext, PostContext } from "../../utils/context";
import { useNavigate } from "react-router-dom";

type CommentCreateProps = {
  comments: CommentProps[];
  commentReplyId: null | number;
};

const CommentCreate: React.FC<CommentCreateProps> = ({ comments, commentReplyId }) => {
  const blogContext = useContext(BlogContext);
  const postContext = useContext(PostContext);
  const navigate = useNavigate();
  const textRef = useRef<HTMLTextAreaElement>(null);

  const createComment = () => {
    const data = {
      text: textRef.current?.value,
      accessToken: localStorage.getItem("accessToken"),
      postId: postContext?.postId,
      commentReplyId: commentReplyId,
    };

    fetch("http://localhost:3030/createComment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(data),
    })
      .then((data) => data.json())
      .then((data) => {
        data.auth ? localStorage.setItem("accessToken", data.accessToken) : navigate("/login");
        if (!data.auth) {
          localStorage.removeItem("username");
        }
        const postId = blogContext?.posts.findIndex((post) => post.id === data.post.id);
        console.log(postId, data.post.id);
        if (postId !== undefined && postId !== -1) {
          blogContext!.posts[postId].comments = data.post.comments;
          console.log(blogContext?.posts);
        }
        blogContext?.setPosts((prev) => [...prev]);
      });
  };

  return (
    <div className="comment-create">
      <textarea name="" id="comment-area" className="comment-area" placeholder="Type here" ref={textRef}></textarea>
      <div className="send" onClick={() => createComment()}>
        Send
      </div>
    </div>
  );
};

export default CommentCreate;

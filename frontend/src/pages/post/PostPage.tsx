import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./PostPage.scss";
import { CommentType } from "../blog/Blog";
import Comment from "../../components/comment/Comment";
import { PostContext } from "../../utils/context";
import CommentCreate from "../../components/commentWrite/CommentCreate";
import { renderPost, url } from "../../utils/utils";
import { PostElement } from "../createPost/CreatePost";

type Post = {
  id: string;
  elements: PostElement[];
  title: string;
  publisherPhoto: string;
  publisherUsername: string;
  comments: CommentType[];
  commentsCounter: number;
};

const PostPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [post, setPost] = useState<Post>({
    id: "",
    title: "",
    elements: [],
    publisherPhoto: "",
    publisherUsername: "",
    comments: [],
    commentsCounter: 0,
  });
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState<boolean>(false);
  const [isCommentCreateOpen, setIsCommentCreateOpen] = useState<{ isOpen: boolean; id: null | number }>({
    isOpen: false,
    id: null,
  });
  const [socket, setSocket] = useState<WebSocket>();

  const commentsRender = (item: CommentType) => <Comment {...item} />;

  useEffect(() => {
    setSocket(new WebSocket("ws://localhost:3333"));
  }, []);

  useEffect(() => {
    if (socket) {
      socket.onopen = () => {
        const data = {
          type: "connect",
          postId: id,
        };
        socket.send(JSON.stringify(data));
      };

      socket.onmessage = (mes) => {
        console.log(mes.data);
        const { type, text, postResponse, auth, accessToken, isSender } = JSON.parse(mes.data);

        switch (type) {
          case "message":
            if (isSender) {
              auth ? localStorage.setItem("accessToken", accessToken) : navigate("/login");
              if (!auth) {
                localStorage.removeItem("username");
              }
            }

            setIsCommentCreateOpen((prev) => ({ ...prev, isOpen: false }));
            setPost({ ...postResponse });

            break;

          case "error":
            alert(text);
        }
      };

      socket.onclose = () => {
        const data = {
          type: "disconnect",
          postId: id,
        };
        socket.send(JSON.stringify(data));
      };
    }

    return () => {
      if (socket) {
        socket.onmessage = null;
        socket.onopen = null;
        socket.onclose = null;
      }
    };
  }, [socket]);

  useEffect(() => {
    setIsFetching(true);
  }, [id]);

  useEffect(() => {
    if (isFetching) {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        navigate("/login");
        return;
      }
      fetch(`${url}/post/${id}`)
        .then((data) => data.json())
        .then((data) => {
          setPost(data.post);
          setIsFetching(false);
        });
    }
  }, [isFetching]);

  return (
    <div className="post-wrapper">
      <div className="post-align">
        <div className="post">
          <div className="post-top">
            <div className="title">{post.title}</div>
            <Link to={`/profile/${post.publisherUsername}`} className="publisher-wrapper">
              <div className="publisher-name">{post.publisherUsername}</div>
              <div className="publisher-photo">
                <img src={`${post.publisherPhoto}`} alt="post" className="post-img" />
              </div>
            </Link>
          </div>
          <div className="elements">{post.elements.map(renderPost)}</div>
          <PostContext.Provider
            value={{
              postId: id || "",
              socket: socket || null,
              isCommentCreateOpen: isCommentCreateOpen,
              setIsCommentCreateOpen: setIsCommentCreateOpen,
            }}
          >
            <div className="comments-wrapper">
              <span
                className="close-open-comments"
                onClick={() => {
                  setIsCommentsOpen((prev) => !prev);
                  setIsCommentCreateOpen((prev) => ({ ...prev, isOpen: false }));
                }}
              >
                {!isCommentsOpen ? "Open" : "Close"} comments
              </span>
              {!isCommentsOpen ? (
                false
              ) : (
                <div
                  className="create"
                  onClick={() => setIsCommentCreateOpen((prev) => ({ ...prev, isOpen: !prev.isOpen }))}
                >
                  Comment
                </div>
              )}
              {isCommentCreateOpen.isOpen && isCommentCreateOpen.id === null ? (
                <CommentCreate comments={post.comments || []} commentReplyId={null} />
              ) : (
                false
              )}
              {!isCommentsOpen ? false : post.comments && post.comments.map(commentsRender)}
            </div>
          </PostContext.Provider>
        </div>
      </div>
    </div>
  );
};

export default PostPage;

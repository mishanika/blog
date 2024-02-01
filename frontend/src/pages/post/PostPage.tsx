import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./PostPage.scss";
import { CommentType } from "../blog/Blog";
import Comment from "../../components/comment/Comment";
import { PostContext } from "../../utils/context";
import CommentCreate from "../../components/commentWrite/CommentCreate";
import { renderPost, url } from "../../utils/utils";
import { PostElement } from "../createPost/CreatePost";
import Avatar from "../../components/avatar/Avatar";

type Post = {
  id: string;
  elements: PostElement[];
  title: string;
  publisherPhoto: string;
  publisherUsername: string;
  comments: CommentType[];
  commentsCounter: number;
  rating: number;
  likedByYou: boolean;
  dislikedByYou: boolean;
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
    rating: 0,
    likedByYou: false,
    dislikedByYou: false,
  });
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState<boolean>(false);
  const [isCommentCreateOpen, setIsCommentCreateOpen] = useState<{ isOpen: boolean; id: null | number }>({
    isOpen: false,
    id: null,
  });
  const [socket, setSocket] = useState<WebSocket>();

  const commentsRender = (item: CommentType) => <Comment {...item} />;

  const handleRating = (type: string) => {
    const data = {
      postId: post.id,
      accessToken: localStorage.getItem("accessToken"),
      type: type,
    };

    fetch(`${url}/post/ratingHandle`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(data),
    })
      .then((data) => data.json())
      .then((data) => {
        setPost(data);
      });
  };

  useEffect(() => {
    setSocket(new WebSocket("wss://blog-back-delta.vercel.app:3333"));
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
      fetch(`${url}/post/${id}/${token}`)
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
                <Avatar photo={post.publisherPhoto} username={post.publisherUsername} className={"post-img"} />
              </div>
            </Link>
          </div>
          <div className="elements">{post.elements.map(renderPost)}</div>
          <div className="rating">
            <div className={`inc-rating ${post.likedByYou ? "liked" : ""}`} onClick={() => handleRating("inc")}>
              +
            </div>
            <div className="rating-number">{post.rating}</div>
            <div className={`dec-rating ${post.dislikedByYou ? "disliked" : ""}`} onClick={() => handleRating("dec")}>
              -
            </div>
          </div>
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
                  Leave a comment
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

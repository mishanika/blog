import { createContext } from "react";
import { PostType } from "../pages/blog/Blog";

export const BlogContext = createContext<IBlogContext | null>(null);
export const PostContext = createContext<IPostContext | null>(null);

export interface IBlogContext {
  posts: PostType[];
  setPosts: React.Dispatch<React.SetStateAction<PostType[]>>;
}
export interface IPostContext {
  socket: WebSocket | null;
  postId: string;
  setIsCommentCreateOpen: React.Dispatch<
    React.SetStateAction<{
      isOpen: boolean;
      id: null | number;
    }>
  >;
  isCommentCreateOpen: {
    isOpen: boolean;
    id: null | number;
  };
}
